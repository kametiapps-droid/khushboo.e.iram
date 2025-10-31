import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CartDrawer } from "@/components/CartDrawer";
import { MobileMenu } from "@/components/MobileMenu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, ShoppingCart, Gift, Heart, Share2, Check } from "lucide-react";

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

export default function ProductDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [includeGiftBox, setIncludeGiftBox] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });

  const { data: allProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: cartData = [] } = useQuery<CartItemWithProduct[]>({
    queryKey: ['/api/cart'],
  });

  const relatedProducts = product?.categoryId 
    ? allProducts.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4)
    : [];

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId }: { productId: string }) => {
      return apiRequest('POST', '/api/cart', { productId, quantity: 1 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      setAddingToCart(false);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
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

  const handleAddToCart = () => {
    if (product) {
      setAddingToCart(true);
      addToCartMutation.mutate({ productId: product.id });
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

  const handleRelatedProductClick = (productId: string) => {
    setLocation(`/product/${productId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitReview = () => {
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
    setReviewText("");
    setReviewRating(5);
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

  if (productLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          cartItemCount={cartItemCount}
          onCartClick={() => setCartOpen(true)}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          cartItemCount={cartItemCount}
          onCartClick={() => setCartOpen(true)}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Product not found</h2>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist</p>
            <Button onClick={() => setLocation("/shop")}>Back to Shop</Button>
          </div>
        </div>
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
        {/* Product Details Section */}
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    data-testid="img-product-detail"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2" data-testid="text-brand">
                    {product.brand}
                  </p>
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light mb-4" data-testid="text-product-name">
                    {product.name}
                  </h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1" data-testid="rating-product">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < product.rating
                              ? "fill-primary text-primary"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.rating} out of 5)
                    </span>
                  </div>

                  <p className="text-3xl sm:text-4xl font-semibold mb-4" data-testid="text-product-price">
                    PKR {parseFloat(product.price).toLocaleString()}
                  </p>

                  <Badge variant={product.stock > 0 ? "default" : "destructive"} data-testid="badge-stock">
                    {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground" data-testid="text-description">
                    {product.description}
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock === 0}
                    data-testid="button-add-to-cart"
                  >
                    {addingToCart ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Adding to Cart...
                      </>
                    ) : addedToCart ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" size="lg" className="flex-1" data-testid="button-wishlist">
                      <Heart className="mr-2 h-5 w-5" />
                      Wishlist
                    </Button>
                    <Button variant="outline" size="lg" className="flex-1" data-testid="button-share">
                      <Share2 className="mr-2 h-5 w-5" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Details Tabs Section */}
        <section className="py-8 sm:py-12 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="w-full justify-start" data-testid="tabs-product-info">
                <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
                <TabsTrigger value="information" data-testid="tab-information">More Information</TabsTrigger>
                <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-6 space-y-4" data-testid="content-details">
                <div className="bg-background rounded-lg p-6">
                  <h3 className="font-semibold text-xl mb-4">Product Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Brand</p>
                      <p className="font-medium">{product.brand}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stock</p>
                      <p className="font-medium">{product.stock} units</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-medium">{product.rating} / 5 stars</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">Luxury Fragrance</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="information" className="mt-6 space-y-4" data-testid="content-information">
                <div className="bg-background rounded-lg p-6">
                  <h3 className="font-semibold text-xl mb-4">Additional Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-medium">100ml</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium">Eau de Parfum</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Longevity</span>
                      <span className="font-medium">6-8 hours</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-muted-foreground">Occasion</span>
                      <span className="font-medium">All occasions</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">Made In</span>
                      <span className="font-medium">Pakistan</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6 space-y-6" data-testid="content-reviews">
                <div className="bg-background rounded-lg p-6">
                  <h3 className="font-semibold text-xl mb-4">Customer Reviews</h3>
                  
                  {/* Sample Review */}
                  <div className="space-y-4 mb-6">
                    <div className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <span className="font-medium">Excellent fragrance!</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Amazing quality and long-lasting scent. Highly recommended!
                      </p>
                      <p className="text-xs text-muted-foreground">- Anonymous Customer</p>
                    </div>
                  </div>

                  {/* Add Review Form */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Write a Review</h4>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rating</label>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              i < reviewRating
                                ? "fill-primary text-primary"
                                : "fill-muted text-muted hover:fill-primary/50"
                            }`}
                            onClick={() => setReviewRating(i + 1)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Review</label>
                      <Textarea
                        placeholder="Share your thoughts about this product..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        rows={4}
                        data-testid="input-review"
                      />
                    </div>
                    <Button onClick={handleSubmitReview} data-testid="button-submit-review">
                      Submit Review
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Gift Box Section */}
        <section className="py-8 sm:py-12 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-muted/30 rounded-lg p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Gift className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl font-light mb-2">Add Gift Box</h3>
                  <p className="text-muted-foreground mb-4">
                    Make your purchase extra special with our premium gift box packaging
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="gift-box"
                        checked={includeGiftBox}
                        onCheckedChange={(checked) => setIncludeGiftBox(checked as boolean)}
                        data-testid="checkbox-gift-box"
                      />
                      <label htmlFor="gift-box" className="text-sm font-medium cursor-pointer">
                        Include luxury gift box packaging
                      </label>
                    </div>
                    <Badge variant="secondary">+ PKR 500</Badge>
                  </div>
                  {includeGiftBox && (
                    <p className="text-sm text-muted-foreground">
                      ✓ Elegant premium gift box included
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="py-12 sm:py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-3xl sm:text-4xl font-light mb-8 text-center" data-testid="text-related-products">
                Related Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    id={relatedProduct.id}
                    name={relatedProduct.name}
                    brand={relatedProduct.brand}
                    price={parseFloat(relatedProduct.price)}
                    image={relatedProduct.image}
                    rating={relatedProduct.rating}
                    onAddToCart={handleAddToCart}
                    onClick={handleRelatedProductClick}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
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
