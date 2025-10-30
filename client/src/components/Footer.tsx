import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiInstagram, SiFacebook, SiX } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div>
            <h3 className="font-serif text-2xl font-light mb-4" data-testid="text-footer-brand">
              KHUSHBOO.E.IRAM
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover the finest selection of luxury perfumes, traditional attar, and premium fragrances.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-shop-title">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-all-products">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories/perfumes" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-perfumes">
                  Perfumes
                </Link>
              </li>
              <li>
                <Link href="/categories/attar" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-attar">
                  Attar
                </Link>
              </li>
              <li>
                <Link href="/categories/body-spray" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-body-spray">
                  Body Spray
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-support-title">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-shipping">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-returns">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4" data-testid="text-footer-newsletter-title">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe for exclusive offers and updates
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                className="flex-1"
                data-testid="input-newsletter"
              />
              <Button data-testid="button-subscribe">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground" data-testid="text-copyright">
            © 2025 KHUSHBOO.E.IRAM. All rights reserved.
          </p>

          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-instagram"
            >
              <SiInstagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-facebook"
            >
              <SiFacebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="link-twitter"
            >
              <SiX className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
