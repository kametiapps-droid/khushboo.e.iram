import { useState } from "react";
import { ShoppingCart, Search, Menu, User, LogOut, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { SearchDialog } from "./SearchDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
  onMenuClick?: () => void;
}

export function Header({ cartItemCount = 0, onCartClick, onMenuClick }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();

  const isActive = (path: string) => location === path;

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) return null;
      const data = await response.json();
      return data.user;
    },
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/auth');
    },
  });

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logoutMutation.mutate();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 sm:h-18 md:h-20 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={onMenuClick}
              data-testid="button-menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link href="/">
              <div className="flex flex-col cursor-pointer transition-opacity hover:opacity-80" data-testid="link-home">
                <h1 className="font-serif text-lg sm:text-xl md:text-2xl font-light tracking-wide">
                  KHUSHBOO.E.IRAM
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Luxury Fragrances</p>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Button 
              variant="ghost" 
              data-testid="nav-home" 
              asChild
              className={isActive("/") ? "bg-accent" : ""}
            >
              <Link href="/">Home</Link>
            </Button>
            <Button 
              variant="ghost" 
              data-testid="nav-shop" 
              asChild
              className={isActive("/shop") ? "bg-accent" : ""}
            >
              <Link href="/shop">Shop</Link>
            </Button>
            <Button 
              variant="ghost" 
              data-testid="nav-categories" 
              asChild
              className={isActive("/categories") ? "bg-accent" : ""}
            >
              <Link href="/categories">Categories</Link>
            </Button>
            <Button 
              variant="ghost" 
              data-testid="nav-contact" 
              asChild
              className={isActive("/contact") ? "bg-accent" : ""}
            >
              <Link href="/contact">Contact</Link>
            </Button>
            <Button 
              variant="ghost" 
              data-testid="nav-admin" 
              asChild
              className={isActive("/admin") ? "bg-accent" : ""}
            >
              <Link href="/admin">Admin</Link>
            </Button>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              data-testid="button-search"
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9"
            >
              <Search className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    data-testid="button-account"
                    className="h-9 w-9"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{userData.username || 'User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                data-testid="button-account"
                className="h-9 w-9"
              >
                <Link href="/auth">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 min-w-5 justify-center p-0 text-xs"
                  data-testid="badge-cart-count"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>
      
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
