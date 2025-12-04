"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { getCartItemCount } from "@/lib/cart";

export function Navbar() {
  const { items, openCart } = useCart();
  const { user, isLoading, signOut } = useAuth();
  const itemCount = getCartItemCount(items);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 mt-8 px-4">
              <Link
                href="/"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-lg font-medium hover:text-primary transition-colors"
              >
                Products
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <span className="font-bold text-xl hidden sm:inline-block">
            Store
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Products
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={openCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
            <span className="sr-only">Open cart</span>
          </Button>

          {/* User menu */}
          {isLoading ? (
            <Button variant="ghost" size="icon" disabled>
              <User className="h-5 w-5" />
            </Button>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">
                    <Package className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

