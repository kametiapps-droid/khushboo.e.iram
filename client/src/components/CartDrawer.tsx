import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items?: CartItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onCheckout?: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 100;
  const shippingProgress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        data-testid="overlay-cart"
      />
      <div className="fixed right-0 top-0 h-full w-[75vw] sm:w-80 md:w-96 max-w-sm bg-background z-50 shadow-xl flex flex-col transition-transform duration-300" data-testid="drawer-cart">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="font-serif text-2xl font-medium" data-testid="text-cart-title">
            Shopping Cart
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-cart">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-serif text-xl mb-2" data-testid="text-empty-cart">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Add some fragrances to get started</p>
            <Button onClick={onClose} data-testid="button-continue-shopping">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4" data-testid={`cart-item-${item.id}`}>
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                        data-testid={`img-cart-item-${item.id}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground" data-testid={`text-cart-brand-${item.id}`}>
                        {item.brand}
                      </p>
                      <h4 className="font-medium truncate" data-testid={`text-cart-name-${item.id}`}>
                        {item.name}
                      </h4>
                      <p className="text-sm font-semibold mt-1" data-testid={`text-cart-price-${item.id}`}>
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                          data-testid={`button-decrease-${item.id}`}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center" data-testid={`text-quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                          data-testid={`button-increase-${item.id}`}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-auto text-destructive"
                          onClick={() => onRemove?.(item.id)}
                          data-testid={`button-remove-${item.id}`}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-6 space-y-4">
              {subtotal < freeShippingThreshold && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Free shipping progress</span>
                    <span className="font-medium">
                      ${(freeShippingThreshold - subtotal).toFixed(2)} away
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${shippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between text-lg font-semibold">
                <span data-testid="text-subtotal-label">Subtotal</span>
                <span data-testid="text-subtotal-amount">${subtotal.toFixed(2)}</span>
              </div>

              <Button className="w-full" size="lg" onClick={onCheckout} data-testid="button-checkout">
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={onClose}
                data-testid="button-continue-shopping-bottom"
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
