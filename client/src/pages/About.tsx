import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/MobileMenu";
import { CartDrawer } from "@/components/CartDrawer";
import { useState } from "react";
import { Award, Heart, Shield, Sparkles } from "lucide-react";

export default function About() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={0}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <main className="flex-1">
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mb-6 text-center">
                About KHUSHBOO.E.IRAM
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground text-center mb-12">
                Your destination for authentic luxury fragrances
              </p>

              <div className="prose prose-lg max-w-none">
                <p className="text-base sm:text-lg leading-relaxed mb-6">
                  Welcome to KHUSHBOO.E.IRAM, where the art of fragrance meets timeless elegance. We are passionate about bringing you the finest collection of luxury perfumes, traditional attar, and premium body sprays from around the world.
                </p>

                <p className="text-base sm:text-lg leading-relaxed mb-6">
                  Founded with a vision to make premium fragrances accessible to discerning customers in Pakistan, we curate each product with meticulous attention to authenticity, quality, and craftsmanship. Our collection features both internationally renowned brands and artisanal traditional scents that have captivated hearts for generations.
                </p>

                <p className="text-base sm:text-lg leading-relaxed mb-12">
                  At KHUSHBOO.E.IRAM, we believe that the right fragrance is more than just a scent—it's an expression of your personality, a memory maker, and a confidence booster. That's why we're committed to helping you discover your signature scent through our carefully selected range of products.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                    <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">100% Authentic</h3>
                  <p className="text-sm text-muted-foreground">Only genuine products from trusted sources</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                    <Award className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Premium Quality</h3>
                  <p className="text-sm text-muted-foreground">Carefully curated luxury fragrances</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Customer First</h3>
                  <p className="text-sm text-muted-foreground">Dedicated support for your satisfaction</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Exclusive Collection</h3>
                  <p className="text-sm text-muted-foreground">Rare and unique fragrance selections</p>
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
        items={[]}
        onUpdateQuantity={() => {}}
        onRemove={() => {}}
        onCheckout={() => {}}
      />
    </div>
  );
}
