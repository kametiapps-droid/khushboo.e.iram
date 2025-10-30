import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  User, 
  ShoppingBag, 
  Package, 
  Heart, 
  LogOut, 
  Mail, 
  Calendar,
  Trash2,
  Plus,
  Minus
} from "lucide-react";

interface User {
  id: string;
  email: string;
  username?: string;
  googleId?: string;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
}

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: Product;
}

interface Order {
  id: string;
  email: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  total: string;
  status: string;
  createdAt: string;
}

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        if (response.status === 401) {
          navigate('/auth');
        }
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      return data.user as User;
    },
  });

  const { data: cartItems = [], isLoading: cartLoading } = useQuery({
    queryKey: ['cart', userData?.id],
    queryFn: async () => {
      const response = await fetch('/api/cart');
      if (!response.ok) throw new Error('Failed to fetch cart');
      return response.json() as Promise<CartItem[]>;
    },
    enabled: !!userData,
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['orders', userData?.id],
    queryFn: async () => {
      const response = await fetch(`/api/orders/user/${userData?.id}`);
      if (!response.ok) return [];
      return response.json() as Promise<Order[]>;
    },
    enabled: !!userData,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/auth');
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const response = await fetch(`/api/cart/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error('Failed to update cart');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove item');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logoutMutation.mutate();
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate(id);
    } else {
      updateCartMutation.mutate({ id, quantity });
    }
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (userError || !userData) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <main className="flex-1 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold">My Account</h1>
              <p className="text-muted-foreground">Welcome back, {userData.username || userData.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="cart">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Cart ({cartItemCount})
              </TabsTrigger>
              <TabsTrigger value="orders">
                <Package className="mr-2 h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist">
                <Heart className="mr-2 h-4 w-4" />
                Wishlist
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your account details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{userData.username || 'User'}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {userData.email}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4">
                      <div>
                        <label className="text-sm font-medium">Username</label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {userData.username || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-sm text-muted-foreground mt-1">{userData.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Account Type</label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {userData.googleId ? (
                            <Badge variant="secondary">Google Account</Badge>
                          ) : (
                            <Badge variant="secondary">Email Account</Badge>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Statistics</CardTitle>
                    <CardDescription>Your shopping activity overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Total Orders</p>
                        <p className="text-2xl font-bold">{orders.length}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Cart Items</p>
                        <p className="text-2xl font-bold">{cartItemCount}</p>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">Wishlist Items</p>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="cart">
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Cart</CardTitle>
                  <CardDescription>
                    {cartItemCount === 0 
                      ? 'Your cart is empty' 
                      : `You have ${cartItemCount} item${cartItemCount > 1 ? 's' : ''} in your cart`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cartLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                      <p className="text-muted-foreground mb-4">
                        Start shopping to add items to your cart
                      </p>
                      <Button onClick={() => navigate('/shop')}>Browse Products</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-4 border rounded-lg p-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.product.name}</h4>
                            <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                            <p className="text-lg font-bold mt-1">
                              PKR {parseFloat(item.product.price).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => removeFromCartMutation.mutate(item.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}

                      <Separator />

                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span>PKR {cartTotal.toLocaleString()}</span>
                      </div>

                      <Button className="w-full" size="lg">
                        Proceed to Checkout
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>
                    Track and manage your orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {ordersLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't placed any orders yet
                      </p>
                      <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <div>
                              <h4 className="font-semibold">Order #{order.id.slice(0, 8)}</h4>
                              <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <p className="font-bold">PKR {parseFloat(order.total).toLocaleString()}</p>
                            </div>
                          </div>
                          <Separator className="my-3" />
                          <div className="text-sm">
                            <p><strong>Name:</strong> {order.name}</p>
                            <p><strong>Email:</strong> {order.email}</p>
                            <p><strong>Address:</strong> {order.address}, {order.city} {order.postalCode}, {order.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card>
                <CardHeader>
                  <CardTitle>My Wishlist</CardTitle>
                  <CardDescription>Save your favorite items for later</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Save items you love to your wishlist
                    </p>
                    <Button onClick={() => navigate('/shop')}>Browse Products</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems.map(item => ({
          id: item.id,
          name: item.product.name,
          brand: item.product.brand,
          price: parseFloat(item.product.price),
          quantity: item.quantity,
          image: item.product.image,
        }))}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={(id) => removeFromCartMutation.mutate(id)}
        onCheckout={() => console.log("Checkout clicked")}
      />
    </div>
  );
}
