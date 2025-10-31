import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu } from "@/components/MobileMenu";
import { Footer } from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Shield, Truck, CreditCard, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: string;
  image: string;
  categoryId: string | null;
  rating: number;
  stock: number;
}

interface CartItemWithProduct {
  id: string;
  sessionId: string | null;
  userId: string | null;
  productId: string;
  quantity: number;
  product: Product;
}

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const { data: cartData = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
  });

  const addToCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      return apiRequest('POST', '/api/cart', { productId, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      setCartOpen(true);
      toast({
        title: "Added to cart",
        description: "Product has been added to your cart",
      });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest('PATCH', `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
    },
  });

  const featuredProducts = products.slice(0, 8);

  const handleAddToCart = (productId: string) => {
    addToCartMutation.mutate(productId);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate(id);
    } else {
      updateCartMutation.mutate({ id, quantity });
    }
  };

  const handleRemove = (id: string) => {
    removeFromCartMutation.mutate(id);
  };

  const cartItems: CartItem[] = cartData.map(item => ({
    id: item.id,
    name: item.product.name,
    brand: item.product.brand,
    price: parseFloat(item.product.price),
    quantity: item.quantity,
    image: item.product.image,
  }));

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setMobileMenuOpen(true)}
      />

      <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <main className="flex-1">
        <Hero />

        {/* Featured Products Only */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
              {featuredProducts.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={parseFloat(product.price)}
                  image={product.image}
                  rating={product.rating}
                  onAddToCart={handleAddToCart}
                  onClick={() => setLocation("/shop")}
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
