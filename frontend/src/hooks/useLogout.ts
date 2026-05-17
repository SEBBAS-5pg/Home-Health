"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

// Limpia auth + carrito + token y manda a /login.
// Lo usan Sidebar, AdminShell y ClientShell.
export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.logout);
  const clearCart = useCartStore((s) => s.clear);

  return () => {
    clearAuth();
    clearCart();
    if (typeof window !== "undefined") {
      localStorage.removeItem("hh_token");
    }
    router.push("/login");
  };
}
