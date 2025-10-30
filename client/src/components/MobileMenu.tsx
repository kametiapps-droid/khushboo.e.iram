import { X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ isOpen, onOpenChange }: MobileMenuProps) {
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Categories", href: "/categories" },
    { label: "Contact", href: "/contact" },
    { label: "Admin", href: "/admin" },
    { label: "Login / Sign Up", href: "/auth" },
  ];

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl font-light text-left">
            Menu
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="justify-start text-lg"
              asChild
              onClick={handleLinkClick}
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
