import type { Express } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import rateLimit from 'express-rate-limit';
import validator from 'validator';
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertCategorySchema, 
  insertCartItemSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "@shared/schema";

if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'khushboo-iram-jwt-secret-change-in-production') {
    console.error('ERROR: JWT_SECRET must be set in production environment');
    process.exit(1);
  }
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'khushboo-iram-secret-key-change-in-production') {
    console.error('ERROR: SESSION_SECRET must be set in production environment');
    process.exit(1);
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'khushboo-iram-jwt-secret-change-in-production';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
) : null;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many authentication attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

async function requireAuth(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
}

async function requireAdmin(req: any, res: any, next: any) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const user = await storage.getUser(req.session.userId);
  if (!user || user.isAdmin !== 'true') {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/signup", authLimiter, async (req, res) => {
    try {
      const validated = signupSchema.parse(req.body);
      
      if (!validator.isEmail(validated.email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      
      const existingUser = await storage.getUserByEmail(validated.email);
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(validated.password, 12);
      const user = await storage.createUser({
        email: validated.email.toLowerCase().trim(),
        username: validated.username.trim(),
        password: hashedPassword,
      });

      req.session.userId = user.id;
      await storage.updateLastLogin(user.id);
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        user: { id: user.id, email: user.email, username: user.username },
        token 
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const validated = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(validated.email.toLowerCase().trim());
      if (!user || !user.password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
        const minutesLeft = Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / (60 * 1000));
        return res.status(423).json({ 
          error: `Account temporarily locked due to multiple failed login attempts. Please try again in ${minutesLeft} minute(s).` 
        });
      }

      const validPassword = await bcrypt.compare(validated.password, user.password);
      if (!validPassword) {
        await storage.incrementFailedLoginAttempts(user.id);
        const updatedUser = await storage.getUser(user.id);
        const remainingAttempts = 5 - (updatedUser?.failedLoginAttempts || 0);
        
        if (remainingAttempts > 0) {
          return res.status(401).json({ 
            error: `Invalid email or password. ${remainingAttempts} attempt(s) remaining before account lockout.` 
          });
        } else {
          return res.status(423).json({ 
            error: "Account locked due to multiple failed login attempts. Please try again in 15 minutes." 
          });
        }
      }

      await storage.resetFailedLoginAttempts(user.id);
      await storage.updateLastLogin(user.id);
      
      req.session.userId = user.id;
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username,
          isAdmin: user.isAdmin === 'true'
        },
        token 
      });
    } catch (error: any) {
      console.error("Error logging in:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: "Failed to log in" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ 
        user: { 
          id: user.id, 
          email: user.email, 
          username: user.username,
          googleId: user.googleId,
          isAdmin: user.isAdmin === 'true'
        }
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/auth/forgot-password", authLimiter, async (req, res) => {
    try {
      const validated = forgotPasswordSchema.parse(req.body);
      
      if (!validator.isEmail(validated.email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      
      const user = await storage.getUserByEmail(validated.email.toLowerCase().trim());
      if (!user) {
        return res.json({ message: "If that email exists, a reset link has been sent" });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiry = new Date(Date.now() + 3600000);
      
      await storage.setPasswordResetToken(validated.email.toLowerCase().trim(), resetToken, expiry);

      console.log(`\n========================================`);
      console.log(`PASSWORD RESET REQUESTED`);
      console.log(`Email: ${validated.email}`);
      console.log(`Reset URL: ${process.env.REPLIT_DOMAINS?.split(',')[0] || 'http://localhost:5000'}/reset-password?token=${resetToken}`);
      console.log(`Token expires in 1 hour`);
      console.log(`========================================\n`);

      res.json({ message: "If that email exists, a reset link has been sent" });
    } catch (error) {
      console.error("Error requesting password reset:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  app.post("/api/auth/reset-password", authLimiter, async (req, res) => {
    try {
      const validated = resetPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByResetToken(validated.token);
      if (!user) {
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      const hashedPassword = await bcrypt.hash(validated.password, 12);
      await storage.updateUser(user.id, { password: hashedPassword });
      await storage.clearResetToken(user.id);
      await storage.resetFailedLoginAttempts(user.id);

      res.json({ message: "Password reset successfully" });
    } catch (error: any) {
      console.error("Error resetting password:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: "Failed to reset password" });
    }
  });

  app.get("/api/auth/google", async (req, res) => {
    if (!googleClient) {
      return res.status(500).json({ error: "Google OAuth not configured" });
    }

    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    });

    res.json({ url: authUrl });
  });

  app.get("/api/auth/google/callback", async (req, res) => {
    try {
      if (!googleClient) {
        return res.status(500).send("Google OAuth not configured");
      }

      const { code } = req.query;
      if (!code || typeof code !== 'string') {
        return res.status(400).send("Missing authorization code");
      }

      const { tokens } = await googleClient.getToken(code);
      googleClient.setCredentials(tokens);

      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: GOOGLE_CLIENT_ID!,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).send("Failed to get user info");
      }

      let user = await storage.getUserByGoogleId(payload.sub);
      
      if (!user) {
        user = await storage.getUserByEmail(payload.email);
      }

      if (!user) {
        user = await storage.createUser({
          email: payload.email,
          username: payload.name || payload.email.split('@')[0],
          password: null,
        });
        await storage.updateUser(user.id, { googleId: payload.sub });
      } else if (!user.googleId) {
        await storage.updateUser(user.id, { googleId: payload.sub });
      }

      req.session.userId = user.id;

      res.redirect('/?login=success');
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.redirect('/?login=error');
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Failed to search products" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(400).json({ error: "Failed to create product" });
    }
  });

  app.patch("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const existingProduct = await storage.getProductById(req.params.id);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }
      const product = await storage.updateProduct(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id/products", async (req, res) => {
    try {
      const products = await storage.getProductsByCategory(req.params.id);
      res.json(products);
    } catch (error) {
      console.error("Error fetching category products:", error);
      res.status(500).json({ error: "Failed to fetch category products" });
    }
  });

  app.get("/api/cart", async (req, res) => {
    try {
      if (req.session.userId) {
        const cartItems = await storage.getCartItemsByUserId(req.session.userId);
        res.json(cartItems);
      } else {
        const sessionId = req.session.id;
        const cartItems = await storage.getCartItems(sessionId);
        res.json(cartItems);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ error: "Failed to fetch cart" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const validated = insertCartItemSchema.parse({
        ...req.body,
        sessionId: req.session.userId ? null : req.session.id,
        userId: req.session.userId || null,
      });
      const cartItem = await storage.addToCart(validated);
      res.json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(400).json({ error: "Failed to add to cart" });
    }
  });

  app.patch("/api/cart/:id", async (req, res) => {
    try {
      const { quantity } = req.body;
      if (quantity <= 0) {
        await storage.removeFromCart(req.params.id);
      } else {
        await storage.updateCartItemQuantity(req.params.id, quantity);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating cart:", error);
      res.status(400).json({ error: "Failed to update cart" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(400).json({ error: "Failed to remove from cart" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const sessionId = req.session.id;
      let cartItems;
      
      if (req.session.userId) {
        cartItems = await storage.getCartItemsByUserId(req.session.userId);
      } else {
        cartItems = await storage.getCartItems(sessionId);
      }
      
      if (cartItems.length === 0) {
        return res.status(400).json({ error: "Cart is empty" });
      }

      const total = cartItems.reduce(
        (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
        0
      );

      const validated = insertOrderSchema.parse({
        ...req.body,
        userId: req.session.userId || null,
        total: total.toFixed(2),
      });

      const order = await storage.createOrder(validated);

      for (const item of cartItems) {
        await storage.createOrderItem({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        });
      }

      if (req.session.userId) {
        await storage.clearCartByUserId(req.session.userId);
      } else {
        await storage.clearCart(sessionId);
      }

      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(400).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const order = await storage.getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      const user = await storage.getUser(req.session.userId!);
      if (order.userId !== req.session.userId && user?.isAdmin !== 'true') {
        return res.status(403).json({ error: "Access denied" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/orders/user/:userId", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (req.params.userId !== req.session.userId && user?.isAdmin !== 'true') {
        return res.status(403).json({ error: "Access denied" });
      }
      
      const orders = await storage.getOrdersByUserId(req.params.userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/admin/orders/stats", requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching order stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/admin/orders/status/:status", requireAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrdersByStatus(req.params.status);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders by status:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      await storage.updateOrderStatus(req.params.id, status);
      const updatedOrder = await storage.getOrderById(req.params.id);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.get("/api/admin/orders/monthly-report", requireAdmin, async (req, res) => {
    try {
      const { year, month } = req.query;
      
      const currentDate = new Date();
      const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();
      const targetMonth = month ? parseInt(month as string) - 1 : currentDate.getMonth();
      
      const startDate = new Date(targetYear, targetMonth, 1);
      const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
      
      const orders = await storage.getOrdersByDateRange(startDate, endDate);
      
      const report = {
        month: targetMonth + 1,
        year: targetYear,
        totalOrders: orders.length,
        totalRevenue: orders
          .filter(o => o.status !== 'cancelled')
          .reduce((sum, o) => sum + parseFloat(o.total), 0)
          .toFixed(2),
        ordersByStatus: {
          pending: orders.filter(o => o.status === 'pending').length,
          processing: orders.filter(o => o.status === 'processing').length,
          shipped: orders.filter(o => o.status === 'shipped').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length,
        },
        orders: orders,
      };
      
      res.json(report);
    } catch (error) {
      console.error("Error generating monthly report:", error);
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  app.get("/api/admin/orders/:id/items", requireAdmin, async (req, res) => {
    try {
      const items = await storage.getOrderItemsByOrderId(req.params.id);
      res.json(items);
    } catch (error) {
      console.error("Error fetching order items:", error);
      res.status(500).json({ error: "Failed to fetch order items" });
    }
  });

  app.post("/api/contact", generalLimiter, async (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }
      
      if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }
      
      const sanitizedName = validator.escape(name.trim());
      const sanitizedSubject = validator.escape(subject.trim());
      const sanitizedMessage = validator.escape(message.trim());
      
      console.log("Contact form submission:", {
        name: sanitizedName,
        email: email.toLowerCase().trim(),
        subject: sanitizedSubject,
        message: sanitizedMessage,
        timestamp: new Date().toISOString(),
      });

      res.json({ success: true, message: "Message received successfully" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
