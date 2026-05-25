"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, NavSection } from "./Sidebar";
import { useLogout } from "@/hooks/useLogout";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useAuthStore } from "@/store/auth.store";

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const logout = useLogout();
  const me = useCurrentUser();
  const hydrated = useAuthStore((s) => s.hydrated);

  // Guard de rol: no redirect hasta que la store esté rehidratada.
  useEffect(() => {
    if (!hydrated) return;
    if (!me.isAuthenticated) {
      router.replace("/login");
    } else if (me.role !== "Admin") {
      router.replace("/catalog");
    }
  }, [hydrated, me.isAuthenticated, me.role, router]);

  const adminSections: NavSection[] = [
    {
      title: "Panel",
      items: [
        { label: "Dashboard", href: "/admin/dashboard", icon: "📊" },
        { label: "Pedidos", href: "/admin/orders", icon: "📦", badge: 5 },
        { label: "Productos", href: "/admin/products", icon: "💊" },
        { label: "Inventario", href: "/admin/inventory", icon: "📈" },
        { label: "Vencimientos", href: "/admin/expiry", icon: "⏰" },
      ],
    },
    {
      title: "Gestión",
      items: [
        { label: "Usuarios", href: "/admin/users", icon: "👥" },
        { label: "Reportes", href: "/admin/reports", icon: "📑" },
        { label: "Notificaciones", href: "/admin/notifications", icon: "🔔" },
        { label: "Cerrar sesión", icon: "🚪", onClick: logout, variant: "danger" },
      ],
    },
  ];

  return (
    <div className="flex bg-bg min-h-screen">
      <Sidebar
        sections={adminSections}
        user={{ name: me.name, role: "Admin" }}
        onLogout={logout}
      />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
