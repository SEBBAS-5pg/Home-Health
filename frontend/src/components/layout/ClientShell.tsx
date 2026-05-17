"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, NavSection } from "./Sidebar";
import { useCartStore } from "@/store/cart.store";
import { useLogout } from "@/hooks/useLogout";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export function ClientShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const cartCount = useCartStore((s) => s.totalItems());
  const logout = useLogout();
  const me = useCurrentUser();

  // Si un admin cae aquí por accidente lo mandamos a su panel.
  useEffect(() => {
    if (me.isAuthenticated && me.role === "Admin") {
      router.replace("/admin/dashboard");
    }
  }, [me.isAuthenticated, me.role, router]);

  const sections: NavSection[] = [
    {
      title: "Tienda",
      items: [
        { label: "Catálogo", href: "/catalog", icon: "🛍️" },
        { label: "Mi carrito", href: "/order/new", icon: "🛒", badge: cartCount },
        { label: "Mis pedidos", href: "/my-orders", icon: "📦" },
      ],
    },
    {
      title: "Cuenta",
      items: [
        { label: "Mi perfil", href: "/profile", icon: "👤" },
        { label: "Cerrar sesión", icon: "🚪", onClick: logout, variant: "danger" },
      ],
    },
  ];

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar
        sections={sections}
        user={{ name: me.name, role: "Cliente" }}
        onLogout={logout}
      />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
