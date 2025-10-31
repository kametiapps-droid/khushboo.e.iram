import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
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

export default function Shop() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [sortBy, setSortBy] = useState("featured");
  const { toast } = useToast();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: cartData = [], isLoading: cartLoading } = useQuery<CartItemWithProduct[]>({
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
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
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

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory !== "all") {
        return p.categoryId === selectedCategory;
      }
      return true;
    })
    .filter((p) => {
      const price = parseFloat(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === "price-high") return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        cartItemCount={cartItemCount}
        onCartClick={() => setCartOpen(true)}
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <MobileMenu isOpen={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

      <main className="flex-1">
        <div className="bg-muted/30 py-12 md:py-16">
          <div className="container mx-auto px-6">
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-4" data-testid="text-shop-title">Shop All Products</h1>
            <p className="text-muted-foreground" data-testid="text-shop-subtitle">Discover our complete collection of luxury fragrances</p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-muted/30 p-6 rounded-lg space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="cat-1">Luxury Perfumes</SelectItem>
                      <SelectItem value="cat-2">Traditional Attar</SelectItem>
                      <SelectItem value="cat-3">Body Sprays</SelectItem>
                      <SelectItem value="cat-4">Unisex Fragrances</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-4 block">
                    Price Range (PKR {priceRange[0]} - PKR {priceRange[1]})
                  </Label>
                  <Slider
                    min={0}
                    max={15000}
                    step={500}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mt-4"
                  />
                </div>

                <Button onClick={() => {
                  setSelectedCategory("all");
                  setPriceRange([0, 15000]);
                }} variant="outline" className="w-full">
                  Clear Filters
                </Button>
              </div>
            </aside>

            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} products
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsLoading ? (
                  <p className="text-center py-12 col-span-3" data-testid="text-loading">Loading products...</p>
                ) : (
                  filteredProducts.map((product) => (
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
                    />
                  ))
                )}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No products found matching your filters</p>
                  <Button onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 15000]);
                  }} className="mt-4">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
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
