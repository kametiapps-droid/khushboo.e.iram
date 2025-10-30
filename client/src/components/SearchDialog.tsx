import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useLocation } from "wouter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  image: string;
  rating: number;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(debouncedQuery)}`);
      if (!response.ok) throw new Error("Failed to search products");
      return response.json();
    },
    enabled: debouncedQuery.trim().length > 0,
  });

  const handleProductClick = (productId: string) => {
    onOpenChange(false);
    setSearchQuery("");
    setLocation("/shop");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && products.length > 0) {
      onOpenChange(false);
      setSearchQuery("");
      setLocation("/shop");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] top-[20%] sm:top-[50%] translate-y-0 sm:translate-y-[-50%] max-h-[80vh] sm:max-h-none overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Search Products</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for perfumes, attar, body sprays..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Searching...
            </div>
          )}

          {!isLoading && searchQuery.trim().length > 0 && products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found for "{searchQuery}"
            </div>
          )}

          {!isLoading && products.length > 0 && (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-2">
                Found {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => handleProductClick(product.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <p className="text-sm font-semibold text-primary">
                      PKR {parseFloat(product.price).toLocaleString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={!searchQuery.trim()}>
              <Search className="h-4 w-4 mr-2" />
              View All Results
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
