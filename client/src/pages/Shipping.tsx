import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/MobileMenu";
import { CartDrawer } from "@/components/CartDrawer";
import { useState } from "react";
import { Package, Clock, MapPin, Truck } from "lucide-react";

export default function Shipping() {
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
        <section className="py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mb-6 text-center">
                Shipping Information
              </h1>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Fast and secure delivery across Pakistan
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">On orders over PKR 10,000</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                    <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Fast Delivery</h3>
                  <p className="text-sm text-muted-foreground">3-5 business days</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                    <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Nationwide</h3>
                  <p className="text-sm text-muted-foreground">All cities covered</p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary/10 mb-4">
                    <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Track Order</h3>
                  <p className="text-sm text-muted-foreground">Real-time updates</p>
                </div>
              </div>

              <div className="space-y-8 text-base leading-relaxed">
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">Delivery Timeline</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p><strong className="text-foreground">Major Cities (Karachi, Lahore, Islamabad):</strong> 3-5 business days</p>
                    <p><strong className="text-foreground">Other Cities:</strong> 5-7 business days</p>
                    <p><strong className="text-foreground">Remote Areas:</strong> 7-10 business days</p>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">Shipping Charges</h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>• <strong className="text-foreground">Free Shipping:</strong> On all orders above PKR 10,000</p>
                    <p>• <strong className="text-foreground">Standard Shipping:</strong> PKR 250 for orders below PKR 10,000</p>
                    <p>• <strong className="text-foreground">Express Shipping:</strong> PKR 500 (Delivery in 2-3 business days for major cities)</p>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">Order Processing</h2>
                  <p className="text-muted-foreground mb-3">
                    All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or public holidays.
                  </p>
                  <p className="text-muted-foreground">
                    Once your order is dispatched, you will receive a confirmation email with tracking information to monitor your package's journey.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">Package Tracking</h2>
                  <p className="text-muted-foreground mb-3">
                    You will receive a tracking number via SMS and email once your order is shipped. You can track your package using:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Our website's order tracking page</li>
                    <li>The courier company's website</li>
                    <li>Customer service support</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">Delivery Issues</h2>
                  <p className="text-muted-foreground mb-3">
                    If you don't receive your order within the estimated delivery time, please:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Check your tracking information for updates</li>
                    <li>Verify your shipping address</li>
                    <li>Contact our customer service team for assistance</li>
                  </ul>
                  <p className="text-muted-foreground mt-3">
                    We will work with our shipping partners to resolve any delivery issues promptly.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">International Shipping</h2>
                  <p className="text-muted-foreground">
                    Currently, we only ship within Pakistan. International shipping may be available in the future. Please check back or contact us for updates.
                  </p>
                </div>
              </div>

              <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                <p className="text-muted-foreground mb-4">
                  For any shipping-related questions or concerns, please contact our customer service team.
                </p>
                <a href="/contact" className="text-primary hover:underline font-medium">
                  Contact Us →
                </a>
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
