import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Luxury_perfume_hero_image_25074cf9.png";

export function Hero() {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white max-w-4xl">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light mb-4 sm:mb-6" data-testid="text-hero-title">
            Discover Your Signature Scent
          </h2>
          <p className="font-accent text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 leading-relaxed px-4" data-testid="text-hero-subtitle">
            Explore our exquisite collection of luxury perfumes, traditional attar, and premium body sprays
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto sm:max-w-none">
            <Link href="/categories">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-full sm:w-auto"
                data-testid="button-explore-collection"
              >
                Explore Collection
              </Button>
            </Link>
            <Link href="/shop">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 w-full sm:w-auto"
                data-testid="button-shop-now"
              >
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
