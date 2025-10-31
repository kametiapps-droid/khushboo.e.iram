import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileMenu } from "@/components/MobileMenu";
import { CartDrawer } from "@/components/CartDrawer";
import { ProductCard } from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";

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

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
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

export default function CategoryDetail() {
  const [, params] = useRoute("/categories/:slug");
  const categoryId = params?.slug || "";
  
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: cartData = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, productName }: { productId: string; productName: string }) => {
      return apiRequest('POST', '/api/cart', { productId, quantity: 1 });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      setAddingProductId(null);
      setAddedProductId(variables.productId);
      setTimeout(() => setAddedProductId(null), 2000);
      setCartOpen(true);
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

  const category = categories.find(c => c.id === categoryId);
  const products = allProducts.filter(p => p.categoryId === categoryId);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setAddingProductId(productId);
      addToCartMutation.mutate({ productId, productName: product.name });
    }
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
                {products.length} Products
              </Badge>
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light mb-4">
                {category.name}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                {category.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  brand={product.brand}
                  price={parseFloat(product.price)}
                  image={product.image}
                  rating={product.rating}
                  onAddToCart={handleAddToCart}
                  onClick={(id) => console.log("Product clicked:", id)}
                  isAdding={addingProductId === product.id}
                  isAdded={addedProductId === product.id}
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
