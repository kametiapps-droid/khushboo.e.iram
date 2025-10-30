import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/MobileMenu";
import { CartDrawer } from "@/components/CartDrawer";
import { useState } from "react";
import { RotateCcw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Returns() {
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
                Returns & Refunds
              </h1>
              <p className="text-lg text-muted-foreground text-center mb-12">
                Your satisfaction is our priority
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="p-6 border rounded-lg">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                    <h3 className="font-semibold text-lg">Eligible for Return</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Unopened products in original packaging</li>
                    <li>• Damaged or defective items</li>
                    <li>• Wrong product delivered</li>
                    <li>• Within 7 days of delivery</li>
                  </ul>
                </div>

                <div className="p-6 border rounded-lg">
                  <div className="flex items-center mb-4">
                    <XCircle className="h-8 w-8 text-red-500 mr-3" />
                    <h3 className="font-semibold text-lg">Not Eligible</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Opened or used products</li>
                    <li>• Products without original packaging</li>
                    <li>• Items purchased on sale/clearance</li>
                    <li>• After 7 days from delivery</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-8 text-base leading-relaxed">
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">Return Policy</h2>
                  <p className="text-muted-foreground mb-3">
                    We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return it within 7 days of delivery, provided the product meets our return criteria.
                  </p>
                  <p className="text-muted-foreground">
                    For hygienic reasons, perfumes, attar, and body sprays must be unopened and in their original packaging to be eligible for return.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">How to Return</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold mr-3 flex-shrink-0">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Contact Us</h4>
                        <p className="text-sm text-muted-foreground">
                          Email or call our customer service within 7 days of delivery with your order number and reason for return.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold mr-3 flex-shrink-0">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Get Approval</h4>
                        <p className="text-sm text-muted-foreground">
                          Our team will review your request and provide return authorization if eligible.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold mr-3 flex-shrink-0">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Pack Securely</h4>
                        <p className="text-sm text-muted-foreground">
                          Pack the item in its original packaging with all accessories and documentation.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold mr-3 flex-shrink-0">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Ship It Back</h4>
                        <p className="text-sm text-muted-foreground">
                          We'll arrange pickup or provide a return shipping label. Keep your tracking number.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">Refund Process</h2>
                  <p className="text-muted-foreground mb-3">
                    Once we receive and inspect your returned item, we'll process your refund within 5-7 business days.
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Refunds will be issued to the original payment method</li>
                    <li>For Cash on Delivery orders, refunds will be via bank transfer</li>
                    <li>Shipping charges are non-refundable except for defective/wrong items</li>
                    <li>You'll receive an email confirmation once the refund is processed</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">Damaged or Defective Items</h2>
                  <p className="text-muted-foreground mb-3">
                    If you receive a damaged or defective product:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Contact us within 24 hours of delivery</li>
                    <li>Provide photos of the damaged item and packaging</li>
                    <li>We'll arrange immediate replacement or full refund</li>
                    <li>Return shipping costs will be covered by us</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">Exchange Policy</h2>
                  <p className="text-muted-foreground">
                    We currently don't offer direct exchanges. If you'd like a different product, please return the original item for a refund and place a new order for the desired product.
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2 text-amber-900 dark:text-amber-100">Important Note</h3>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        For health and safety reasons, we cannot accept returns of opened fragrance products. Please ensure you're satisfied with your choice before opening the seal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-6 bg-muted/50 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Questions About Returns?</h3>
                <p className="text-muted-foreground mb-4">
                  Our customer service team is here to help with any return or refund inquiries.
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
