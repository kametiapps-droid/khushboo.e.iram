import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu } from "@/components/MobileMenu";
import { useLocation } from "wouter";

import attarCategory from "@assets/generated_images/Attar_collection_category_image_262b83c4.png";
import bodySprayCategory from "@assets/generated_images/Body_spray_collection_image_78ba13da.png";
import scentCategory from "@assets/generated_images/Scent_collection_category_image_863be1ae.png";

const categories = [
  {
    name: "Premium Perfumes",
    description: "Luxury perfumes from world-renowned brands and exclusive collections",
    image: scentCategory,
    productCount: 32,
    slug: "perfume"
  },
  {
    name: "Traditional Attar",
    description: "Authentic Arabian fragrances crafted with the finest natural ingredients",
    image: attarCategory,
    productCount: 24,
    slug: "attar"
  },
  {
    name: "Body Sprays",
    description: "Fresh and long-lasting body mists perfect for everyday elegance",
    image: bodySprayCategory,
    productCount: 18,
    slug: "body-spray"
  },
];

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Categories() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const handleRemove = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <main className="flex-1">
        <div className="bg-muted/30 py-12 md:py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="font-serif text-4xl md:text-6xl font-light mb-4">
              Fragrance Categories
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our carefully curated collections of premium perfumes, traditional attar, and refreshing body sprays
            </p>
          </div>
        </div>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <CategoryCard
                  key={category.name}
                  {...category}
                  onClick={() => setLocation("/shop")}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-light mb-6">
                Why Choose KHUSHBOO.E.IRAM
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                At KHUSHBOO.E.IRAM, we believe that fragrance is a personal journey. Each scent in our collection has been carefully selected to offer you an exceptional olfactory experience. From traditional Arabian attar to contemporary luxury perfumes, we bring you the finest fragrances from around the world.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div>
                  <h3 className="font-semibold mb-2">100% Authentic</h3>
                  <p className="text-sm text-muted-foreground">
                    All products sourced directly from authorized distributors
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Premium Quality</h3>
                  <p className="text-sm text-muted-foreground">
                    Only the finest ingredients and craftsmanship
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Expert Curation</h3>
                  <p className="text-sm text-muted-foreground">
                    Hand-picked selection by fragrance specialists
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemove}
        onCheckout={() => console.log("Checkout clicked")}
      />
    </div>
  );
}
