import type { CartItem } from "@/types/cart";

const CART_STORAGE_KEY = "ecom-cart";

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce(
    (total, item) => total + item.product.price_cents * item.quantity,
    0
  );
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

export function hasPhysicalItems(items: CartItem[]): boolean {
  return items.some((item) => !item.product.is_digital);
}

export function hasDigitalItems(items: CartItem[]): boolean {
  return items.some((item) => item.product.is_digital);
}

