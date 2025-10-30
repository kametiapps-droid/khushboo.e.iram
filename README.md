# KHUSHBOO.E.IRAM - Luxury Perfume E-Commerce Platform

A professional full-stack e-commerce platform for luxury perfumes, traditional attar, and premium body sprays. Built with modern technologies and designed for an elegant shopping experience.

![Project Banner](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-20.x-green)

## Features

### Customer Features
- 🛍️ **Product Catalog** - Browse luxury perfumes, traditional attar, and body sprays
- 🔍 **Advanced Search** - Find products quickly with intelligent search
- 🛒 **Shopping Cart** - Real-time cart management
- 👤 **User Authentication** - Secure email/password and Google OAuth login
- 📊 **User Dashboard** - Manage profile, view order history, and track shopping data
- 🔐 **Password Reset** - Secure token-based password recovery
- 📱 **Responsive Design** - Seamless experience on mobile, tablet, and desktop
- 🌙 **Dark Mode** - Toggle between light and dark themes

### Admin Features
- 👑 **Admin Panel** - Comprehensive product management dashboard
- ➕ **Add Products** - Create new products with images, prices, and categories
- ✏️ **Edit Products** - Update product information and inventory
- 🗑️ **Delete Products** - Remove products from catalog
- 📈 **Inventory Management** - Track stock levels

### Technical Features
- ⚡ **Fast Performance** - Optimized with Vite and React
- 🔒 **Secure** - bcrypt password hashing, session management
- 🗄️ **PostgreSQL Database** - Reliable data storage with Drizzle ORM
- 🎨 **Modern UI** - Beautiful components with Tailwind CSS and Radix UI
- 📦 **Type-Safe** - Full TypeScript implementation
- 🔄 **Real-time Updates** - TanStack Query for efficient data fetching

## Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful accessible components
- **Wouter** - Lightweight routing
- **TanStack Query** - Server state management
- **Framer Motion** - Smooth animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety on the server
- **Drizzle ORM** - Modern database toolkit
- **PostgreSQL** - Relational database
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing
- **Express Session** - Session management

## Getting Started

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/khushboo-e-iram.git
cd khushboo-e-iram
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=development
SESSION_SECRET=your_secret_key_here
GOOGLE_CLIENT_ID=your_google_client_id (optional)
GOOGLE_CLIENT_SECRET=your_google_client_secret (optional)
```

4. **Initialize the database**
```bash
npm run db:push
```

5. **Seed the database** (optional - adds sample products)
```bash
npx tsx server/seed.ts
```

6. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production server
- `npm run db:push` - Push database schema changes
- `npm run check` - TypeScript type checking

## Project Structure

```
khushboo-e-iram/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # Base UI components (shadcn)
│   │   │   └── ...       # Feature components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities and helpers
│   │   └── App.tsx       # Main app component
│   └── index.html        # HTML entry point
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Data access layer
│   └── seed.ts           # Database seeding script
├── shared/
│   └── schema.ts         # Database schema (Drizzle ORM)
├── attached_assets/      # Static assets (images)
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## Database Schema

### Tables
- **users** - User accounts, authentication, password resets
- **categories** - Product categories (Perfumes, Attar, Body Sprays)
- **products** - Product catalog with prices, images, ratings
- **cart_items** - Shopping cart items linked to users
- **orders** - Customer orders with delivery details
- **order_items** - Line items for each order

## Authentication

The application supports two authentication methods:

1. **Email/Password** - Traditional signup with bcrypt password hashing
2. **Google OAuth** - One-click login with Google (requires configuration)

### Password Reset Flow
1. User requests password reset with email
2. System generates secure token with expiry
3. User receives reset link (currently logged to console in development)
4. User sets new password via secure token validation

## Pages

- **Home** (`/`) - Landing page with hero section and featured products
- **Shop** (`/shop`) - Browse all products
- **Categories** (`/categories`) - View all product categories
- **Category Detail** (`/categories/:id`) - Products by category
- **Admin** (`/admin`) - Product management panel (admin only)
- **Dashboard** (`/dashboard`) - User account dashboard
- **Auth** (`/auth`) - Login and signup
- **Contact** (`/contact`) - Contact information
- **About** (`/about`) - Company information
- **FAQ** (`/faq`) - Frequently asked questions
- **Privacy** (`/privacy`) - Privacy policy
- **Shipping** (`/shipping`) - Shipping information
- **Returns** (`/returns`) - Return and refund policy

## Deployment

### Production Build

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm run start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Configure a strong `SESSION_SECRET`
- Use a production PostgreSQL database URL
- Set up Google OAuth credentials (if using)

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Session-based authentication
- ✅ CSRF protection ready
- ✅ SQL injection protection via ORM
- ✅ XSS protection via React
- ✅ Secure password reset tokens with expiry
- ✅ Environment variable configuration

## Future Enhancements

- 📧 Email service integration for password resets and order confirmations
- 💳 Payment gateway integration (Stripe, PayPal, JazzCash)
- ⭐ Product reviews and ratings system
- ❤️ Wishlist functionality
- 🔔 Email notifications for order updates
- 📊 Admin analytics dashboard
- 🌐 Multi-language support
- 📱 Mobile app (React Native)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please contact us through the website contact page or open an issue on GitHub.

## Acknowledgments

- Design inspired by luxury fragrance retailers
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

---

**Made with ❤️ for fragrance enthusiasts**
