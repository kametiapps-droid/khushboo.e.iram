# KHUSHBOO.E.IRAM - Luxury Perfume E-Commerce Store

## Overview

KHUSHBOO.E.IRAM is a professional luxury perfume e-commerce platform specializing in premium perfumes, traditional attar, and body sprays. The application provides an elegant, fully responsive shopping experience inspired by high-end fragrance retailers. Built with a modern full-stack architecture using React, TypeScript, Express, and PostgreSQL.

## Recent Changes

**October 30, 2025:**
- **Complete Authentication System** with secure password management
  - Email/password signup and login with bcrypt password hashing
  - Google OAuth integration support (requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET)
  - Secure password reset flow with token-based validation
  - Password show/hide toggle using Eye/EyeOff icons
  - Session management with express-session and memorystore
  - Protected routes with authentication middleware
- **User Dashboard** with comprehensive account management
  - Profile section showing user email and account info
  - Cart management with real-time updates
  - Order history with status tracking
  - Shopping statistics and data
- **Updated Database Schema** for authentication
  - Users table with email, hashed password, Google OAuth ID
  - Password reset tokens with expiry timestamps
  - User-order relationships for order history
  - Cart items linked to authenticated users
- **Enhanced Header Component** 
  - Displays logged-in user information
  - User dropdown menu with Dashboard and Logout options
  - Seamless integration with authentication state
- **Separate Reset Password Page** for secure token validation via URL parameters
- **Security Improvements**
  - Reset tokens logged to console (development) instead of API response
  - Token-based validation for password reset
  - Future ready for email integration

**October 28, 2025:**
- **Added Admin Panel** for product management with add/delete functionality
  - Full CRUD API routes for products (POST, PATCH, DELETE)
  - Admin UI with product form and inventory table
  - Form validation and error handling
  - Category selection and real-time product list
- Cleaned up duplicate files and junk (removed example components, zip files, and temporary folders)
- Implemented fully responsive mobile-first design across all pages
- Redesigned professional Header component with working search functionality
- Created comprehensive information pages: About, FAQ, Privacy Policy, Shipping, Returns
- Implemented dynamic category detail pages for Perfumes, Attar, and Body Spray categories
- Updated Footer with working links to all pages
- Enhanced navigation with active state indicators
- Improved all components with better mobile breakpoints (sm, md, lg, xl)
- Optimized typography and spacing for all screen sizes
- Fixed database connection schema configuration

## Project Structure

```
.
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Base UI components (shadcn/ui)
│   │   │   ├── Header.tsx # Professional header with search
│   │   │   ├── Footer.tsx # Comprehensive footer with links
│   │   │   ├── SearchDialog.tsx # Search functionality
│   │   │   ├── Hero.tsx   # Responsive hero section
│   │   │   ├── ProductCard.tsx # Product display cards
│   │   │   ├── CategoryCard.tsx # Category cards
│   │   │   ├── CartDrawer.tsx # Shopping cart drawer
│   │   │   └── MobileMenu.tsx # Mobile navigation
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx   # Main landing page
│   │   │   ├── Shop.tsx   # Product listing
│   │   │   ├── Categories.tsx # All categories
│   │   │   ├── CategoryDetail.tsx # Dynamic category pages
│   │   │   ├── Contact.tsx # Contact page
│   │   │   ├── About.tsx  # About us page
│   │   │   ├── FAQ.tsx    # Frequently asked questions
│   │   │   ├── Privacy.tsx # Privacy policy
│   │   │   ├── Shipping.tsx # Shipping information
│   │   │   ├── Returns.tsx # Returns & refunds policy
│   │   │   ├── Auth.tsx   # Authentication (login/signup)
│   │   │   ├── Dashboard.tsx # User dashboard
│   │   │   ├── ResetPassword.tsx # Password reset page
│   │   │   └── Admin.tsx  # Admin panel
│   │   └── App.tsx        # Main app with routing
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Express server entry point
│   ├── routes.ts          # API route definitions
│   ├── db.ts              # Database connection
│   └── storage.ts         # Data storage layer
├── shared/
│   └── schema.ts          # Database schema (Drizzle ORM)
├── attached_assets/
│   └── generated_images/  # Product and category images
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS config
└── tsconfig.json          # TypeScript configuration
```

## Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast builds and development
- **Wouter** for lightweight routing
- **TanStack Query** for server state management
- **Tailwind CSS** with custom theme for luxury design
- **Shadcn/ui** component library (Radix UI primitives)
- **Framer Motion** for smooth animations

### Backend
- **Node.js** with **Express.js** REST API
- **TypeScript** throughout
- **Drizzle ORM** for database queries
- **Neon** (serverless PostgreSQL) database
- **Authentication**: bcrypt, jsonwebtoken, passport, google-auth-library
- **Session Management**: express-session with memorystore

### Design System
- Custom luxury brand color theme
- Typography: Playfair Display (headings), Inter (body/UI), Cormorant Garamond (accents)
- Fully responsive mobile-first design
- Light/dark mode support
- Smooth transitions and hover effects

## Key Features

### User Experience
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Working search functionality with dialog interface
- ✅ Active navigation state indicators
- ✅ Shopping cart with real-time updates
- ✅ Smooth page transitions
- ✅ Professional luxury brand aesthetic
- ✅ Mobile-optimized navigation menu
- ✅ Complete user authentication system
- ✅ Secure password management with show/hide toggle
- ✅ User dashboard with account management
- ✅ Order history and shopping data

### Pages
- ✅ **Home** - Hero section, featured products, categories, trust badges
- ✅ **Shop** - Product listing page
- ✅ **Categories** - Browse all categories
- ✅ **Category Detail** - Dynamic pages for Perfumes, Attar, Body Spray
- ✅ **Admin** - Product management panel (add, view, delete products)
- ✅ **About** - Company information and values
- ✅ **FAQ** - Comprehensive customer questions and answers
- ✅ **Shipping** - Delivery information and policies
- ✅ **Returns** - Return and refund policies
- ✅ **Privacy** - Privacy policy and data handling
- ✅ **Contact** - Customer service contact page
- ✅ **Auth** - Login/signup with email or Google OAuth
- ✅ **Dashboard** - User profile, cart, order history, shopping data
- ✅ **Reset Password** - Secure token-based password reset

### Responsive Design Breakpoints
- **sm**: 640px (small tablets, large phones)
- **md**: 768px (tablets)
- **lg**: 1024px (small laptops)
- **xl**: 1280px (desktops)

## Database Schema

### Tables
- **users** - User accounts with email, hashed password, Google OAuth ID, reset tokens
- **categories** - Product categories with metadata
- **products** - Product catalog (name, brand, price, images, ratings)
- **cart_items** - Shopping cart linked to authenticated users
- **orders** - Order records with status tracking and user relationships
- **order_items** - Line items for orders

### Authentication Flow
1. **Signup**: User creates account with email/password or Google OAuth
2. **Login**: Secure session-based authentication with bcrypt password verification
3. **Forgot Password**: User requests reset link, token generated and logged to console (development)
4. **Reset Password**: User visits reset URL with token, validates and updates password
5. **Session**: Maintained using express-session with memorystore backend

## Development

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production server
npm run db:push  # Push database schema changes
```

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (automatically set by Replit)
- `NODE_ENV` - Environment (development/production)
- `SESSION_SECRET` - Secret key for session encryption (auto-generated if not set)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional, for Google login)
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret (optional, for Google login)

## Deployment

The application is configured for deployment on Replit with:
- Automatic PostgreSQL database
- Port 5000 configured for frontend
- Production build optimization
- Static asset serving

## Content

All pages include professional, well-written content for a luxury perfume e-commerce store:
- Brand storytelling and values
- Detailed shipping and delivery information
- Comprehensive FAQ covering common customer questions
- Clear return and refund policies
- Privacy policy and data protection information
- Professional product descriptions

## User Preferences

- **Design Style**: Luxury, elegant, professional
- **Target Audience**: Customers looking for authentic premium fragrances in Pakistan
- **Communication**: Simple, customer-friendly language
- **Currency**: PKR (Pakistani Rupees)

## Authentication & Security

### Current Implementation
- ✅ Secure password hashing with bcrypt
- ✅ Session-based authentication with express-session
- ✅ Token-based password reset (secure URL validation)
- ✅ Protected API routes with middleware
- ✅ Google OAuth integration support
- ✅ Password show/hide toggle for better UX

### Development Note
- Password reset tokens are currently logged to server console for development
- In production, these should be sent via email to the user

### Future Security Enhancements
- Hash reset tokens before database storage
- Email delivery service for password reset links (SendGrid/AWS SES)
- Rate limiting on authentication endpoints
- Two-factor authentication (2FA)
- Password strength requirements and validation
- Account lockout after failed login attempts

## Future Enhancements

Potential improvements:
- Email delivery for password resets and order confirmations
- Order processing and payment integration (Stripe/JazzCash)
- Product reviews and ratings
- Wishlist functionality
- Advanced search and filtering
- Email notifications for orders and account activity
- Admin analytics dashboard
- Social login with Facebook/Apple
- Address book and saved shipping information
