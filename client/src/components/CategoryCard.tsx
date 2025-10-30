import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  name: string;
  description: string;
  image: string;
  productCount?: number;
  onClick?: () => void;
}

export function CategoryCard({
  name,
  description,
  image,
  productCount,
  onClick,
}: CategoryCardProps) {
  return (
    <Card className="overflow-visible group cursor-pointer hover-elevate" onClick={onClick} data-testid={`card-category-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          data-testid={`img-category-${name.toLowerCase().replace(/\s+/g, '-')}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 text-white">
          <h3 className="font-serif text-2xl sm:text-2xl md:text-3xl font-medium mb-1 sm:mb-2" data-testid={`text-category-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            {name}
          </h3>
          <p className="font-accent text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2" data-testid={`text-category-description-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            {description}
          </p>
          {productCount !== undefined && (
            <p className="text-xs sm:text-sm text-white/80" data-testid={`text-product-count-${name.toLowerCase().replace(/\s+/g, '-')}`}>
              {productCount} Products
            </p>
          )}
        </div>
      </div>
      <div className="p-4 sm:p-5 md:p-6">
        <Button className="w-full text-sm sm:text-base" data-testid={`button-shop-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          Shop {name}
        </Button>
      </div>
    </Card>
  );
}
