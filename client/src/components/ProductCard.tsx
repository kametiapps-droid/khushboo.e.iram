import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  rating?: number;
  onAddToCart?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function ProductCard({
  id,
  name,
  brand,
  price,
  image,
  rating = 5,
  onAddToCart,
  onClick,
}: ProductCardProps) {
  return (
    <Card
      className="group overflow-visible cursor-pointer hover-elevate"
      onClick={() => onClick?.(id)}
      data-testid={`card-product-${id}`}
    >
      <div className="p-3 sm:p-4">
        <div className="aspect-square mb-3 sm:mb-4 overflow-hidden rounded-md bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            data-testid={`img-product-${id}`}
          />
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground" data-testid={`text-brand-${id}`}>
            {brand}
          </p>
          <h3 className="font-serif text-base sm:text-lg md:text-xl font-medium line-clamp-2" data-testid={`text-name-${id}`}>
            {name}
          </h3>

          <div className="flex items-center gap-0.5 sm:gap-1" data-testid={`rating-${id}`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  i < rating
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 sm:pt-2 flex-wrap gap-2">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold" data-testid={`text-price-${id}`}>
              PKR {price.toLocaleString()}
            </p>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(id);
              }}
              data-testid={`button-add-to-cart-${id}`}
              className="text-xs sm:text-sm"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
