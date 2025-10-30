import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

import perfume1 from "@assets/generated_images/Product_card_perfume_1_d7380d71.png";
import perfume2 from "@assets/generated_images/Product_card_perfume_2_7581cb26.png";
import attar from "@assets/generated_images/Product_card_attar_bottle_2b233b12.png";
import productSample from "@assets/generated_images/Product_sample_perfume_bottle_5df1c02b.png";

const mockProducts = [
  {
    id: "1",
    name: "Elegant Rose Essence",
    brand: "Luxury Fragrances",
    price: 8999,
    image: perfume1,
    rating: 5,
    category: "perfume"
  },
  {
    id: "2",
    name: "Midnight Oud",
    brand: "Premium Collection",
    price: 12000,
    image: perfume2,
    rating: 5,
    category: "perfume"
  },
  {
    id: "3",
    name: "Royal Attar Gold",
    brand: "Traditional Scents",
    price: 7550,
    image: attar,
    rating: 5,
    category: "attar"
  },
  {
    id: "4",
    name: "Ocean Breeze",
    brand: "Fresh Collection",
    price: 6500,
    image: productSample,
    rating: 4,
    category: "body-spray"
  },
  {
    id: "5",
    name: "Jasmine Night",
    brand: "Luxury Fragrances",
    price: 9500,
    image: perfume1,
    rating: 5,
    category: "perfume"
  },
  {
    id: "6",
    name: "Sandalwood Dream",
    brand: "Traditional Scents",
    price: 8000,
    image: attar,
    rating: 4,
    category: "attar"
  },
];

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [sortBy, setSortBy] = useState("featured");

  const handleAddToCart = (productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
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

  const filteredProducts = mockProducts
    .filter((p) => selectedCategory === "all" || p.category === selectedCategory)
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
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
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-4">Shop All Products</h1>
            <p className="text-muted-foreground">Discover our complete collection of luxury fragrances</p>
          </div>
        </div>

        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-muted/30 p-6 rounded-lg space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-4 block">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="perfume">Perfumes</SelectItem>
                      <SelectItem value="attar">Attar</SelectItem>
                      <SelectItem value="body-spray">Body Spray</SelectItem>
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
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onAddToCart={handleAddToCart}
                    onClick={(id) => console.log("Product clicked:", id)}
                  />
                ))}
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
