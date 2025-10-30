import { useState } from "react";
import { useRoute } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/MobileMenu";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";

import perfume1 from "@assets/generated_images/Product_card_perfume_1_d7380d71.png";
import perfume2 from "@assets/generated_images/Product_card_perfume_2_7581cb26.png";
import attar from "@assets/generated_images/Product_card_attar_bottle_2b233b12.png";
import productSample from "@assets/generated_images/Product_sample_perfume_bottle_5df1c02b.png";

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

const categoryData: Record<string, { title: string; description: string; products: any[] }> = {
  perfumes: {
    title: "Luxury Perfumes",
    description: "Discover our exquisite collection of luxury perfumes from world-renowned brands",
    products: [
      { id: "p1", name: "Elegant Rose Essence", brand: "Luxury Fragrances", price: 8999, image: perfume1, rating: 5 },
      { id: "p2", name: "Midnight Oud", brand: "Premium Collection", price: 12000, image: perfume2, rating: 5 },
      { id: "p3", name: "Ocean Breeze", brand: "Fresh Collection", price: 6500, image: productSample, rating: 4 },
      { id: "p4", name: "Royal Romance", brand: "Luxury Fragrances", price: 9500, image: perfume1, rating: 5 },
    ],
  },
  attar: {
    title: "Premium Attar",
    description: "Traditional Arabian fragrances crafted with the finest ingredients",
    products: [
      { id: "a1", name: "Royal Attar Gold", brand: "Traditional Scents", price: 7550, image: attar, rating: 5 },
      { id: "a2", name: "Amber Mystique", brand: "Heritage Collection", price: 8200, image: attar, rating: 5 },
      { id: "a3", name: "Saffron Delight", brand: "Traditional Scents", price: 9000, image: attar, rating: 5 },
      { id: "a4", name: "Musk Al Haramain", brand: "Premium Attar", price: 10500, image: attar, rating: 5 },
    ],
  },
  "body-spray": {
    title: "Body Sprays",
    description: "Fresh and long-lasting body mists for everyday elegance",
    products: [
      { id: "b1", name: "Fresh Morning Mist", brand: "Daily Collection", price: 2500, image: productSample, rating: 4 },
      { id: "b2", name: "Citrus Burst", brand: "Active Life", price: 2200, image: productSample, rating: 4 },
      { id: "b3", name: "Lavender Dreams", brand: "Calm & Fresh", price: 2800, image: productSample, rating: 5 },
      { id: "b4", name: "Sport Energy", brand: "Active Life", price: 2400, image: productSample, rating: 4 },
    ],
  },
};

export default function CategoryDetail() {
  const [, params] = useRoute("/categories/:slug");
  const slug = params?.slug || "";
  
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const category = categoryData[slug];

  const handleAddToCart = (productId: string) => {
    const product = category?.products.find((p) => p.id === productId);
    if (!product) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === productId);
      if (existing) {
        return prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          quantity: 1,
          image: product.image,
        },
      ];
    });
    setCartOpen(true);
  };

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

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          cartItemCount={cartItemCount}
          onCartClick={() => setCartOpen(true)}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="font-serif text-4xl font-light mb-4">Category Not Found</h1>
            <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <main className="flex-1">
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <Badge variant="secondary" className="mb-3 sm:mb-4">
                {category.products.length} Products
              </Badge>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mb-4">
                {category.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onAddToCart={handleAddToCart}
                  onClick={(id) => console.log("Product clicked:", id)}
                />
              ))}
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
