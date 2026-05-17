"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

// Un NavItem puede ser un link (`href`) o una acción (`onClick`).
// Por ejemplo "Cerrar sesión" no navega, ejecuta el hook useLogout.
type BaseNavItem = {
  label: string;
  icon: string;
  badge?: number;
  variant?: "default" | "danger";
};

export type NavItem =
  | (BaseNavItem & { href: string; onClick?: never })
  | (BaseNavItem & { onClick: () => void; href?: never });

export interface NavSection {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  sections: NavSection[];
  user: { name: string; role: "Cliente" | "Admin" };
  onLogout?: () => void;
}

const isLinkItem = (item: NavItem): item is BaseNavItem & { href: string } =>
  typeof (item as { href?: string }).href === "string";

export function Sidebar({ sections, user, onLogout }: SidebarProps) {
  const pathname = usePathname();

  const itemClass = (active: boolean, danger: boolean) =>
    cn(
      "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors w-full text-left",
      active && "bg-primary-50 text-primary-700 font-semibold",
      !active && !danger && "text-text-muted hover:bg-bg hover:text-text",
      !active && danger && "text-coral-600 hover:bg-coral-50"
    );

  return (
    <aside className="w-60 bg-surface border-r border-border flex flex-col p-3.5 min-h-screen">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-2.5 pb-4 mb-3 border-b border-border-light">
        <div className="w-9 h-9 rounded-xl grid place-items-center text-white font-extrabold text-[15px] bg-gradient-to-br from-primary-500 to-coral-400">
          +H
        </div>
        <div>
          <div className="font-bold text-[15px] leading-tight">Home-Health</div>
          <div className="text-[11px] text-text-soft font-medium">{user.role}</div>
        </div>
      </div>

      {/* Sections */}
      <nav className="flex-1 flex flex-col gap-1">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="text-[10px] uppercase tracking-wider text-text-soft font-semibold px-2.5 pt-3 pb-1.5">
              {section.title}
            </div>
            {section.items.map((item) => {
              const danger = item.variant === "danger";

              if (isLinkItem(item)) {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={`${section.title}-${item.label}`}
                    href={item.href}
                    className={itemClass(isActive, danger)}
                  >
                    <span className="w-4 grid place-items-center">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge variant="coral">{item.badge}</Badge>
                    )}
                  </Link>
                );
              }

              return (
                <button
                  key={`${section.title}-${item.label}`}
                  type="button"
                  onClick={item.onClick}
                  className={itemClass(false, danger)}
                >
                  <span className="w-4 grid place-items-center">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer — clicable para cerrar sesión cuando se provee onLogout */}
      <div className="mt-auto pt-3 border-t border-border-light">
        <div className="flex items-center gap-2.5 px-1">
          <Avatar
            initials={user.name}
            variant={user.role === "Admin" ? "primary" : "coral"}
          />
          <div className="text-xs leading-tight flex-1 min-w-0">
            <div className="font-semibold text-text truncate">{user.name}</div>
            <div className="text-text-soft">{user.role}</div>
          </div>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="p-1.5 rounded-lg text-text-muted hover:bg-coral-50 hover:text-coral-600 transition-colors"
            >
              🚪
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
