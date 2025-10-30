import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/MobileMenu";
import { CartDrawer } from "@/components/CartDrawer";
import { useState } from "react";

export default function Privacy() {
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
                Privacy Policy
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-12">
                Last updated: October 2025
              </p>

              <div className="space-y-8 text-base leading-relaxed">
                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">1. Information We Collect</h2>
                  <p className="text-muted-foreground mb-3">
                    We collect information that you provide directly to us when you:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Create an account or make a purchase</li>
                    <li>Sign up for our newsletter</li>
                    <li>Contact us for customer support</li>
                    <li>Participate in surveys or promotions</li>
                  </ul>
                  <p className="text-muted-foreground mt-3">
                    This may include your name, email address, phone number, shipping address, and payment information.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">2. How We Use Your Information</h2>
                  <p className="text-muted-foreground mb-3">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Process and fulfill your orders</li>
                    <li>Communicate with you about your orders and account</li>
                    <li>Send you marketing communications (with your consent)</li>
                    <li>Improve our website and customer service</li>
                    <li>Prevent fraud and ensure security</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">3. Information Sharing</h2>
                  <p className="text-muted-foreground">
                    We do not sell or rent your personal information to third parties. We may share your information with:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
                    <li>Service providers who help us operate our business (e.g., shipping companies, payment processors)</li>
                    <li>Law enforcement when required by law</li>
                    <li>Business partners with your explicit consent</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">4. Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">5. Your Rights</h2>
                  <p className="text-muted-foreground mb-3">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li>Access and receive a copy of your personal data</li>
                    <li>Correct inaccurate or incomplete information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt-out of marketing communications</li>
                    <li>Lodge a complaint with a supervisory authority</li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">6. Cookies</h2>
                  <p className="text-muted-foreground">
                    We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie settings through your browser preferences.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">7. Changes to This Policy</h2>
                  <p className="text-muted-foreground">
                    We may update this privacy policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-semibold mb-3">8. Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have any questions about this privacy policy or our data practices, please contact us through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.
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
        items={[]}
        onUpdateQuantity={() => {}}
        onRemove={() => {}}
        onCheckout={() => {}}
      />
    </div>
  );
}
