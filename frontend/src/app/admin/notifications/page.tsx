"use client";

// HU14 — centro de notificaciones del admin (stock bajo, vencimientos, nuevos pedidos).
import { useMemo, useState } from "react";
import { Notification } from "@/types";
import { notificationService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { api, USE_MOCK } from "@/lib/api";
import { toast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/features/dashboard/StatCard";

type NotificationKind = Notification["kind"];
type ReadFilter = "all" | "unread" | "read";

interface KindMeta {
  label: string;
  icon: string;
  variant: "primary" | "coral" | "warning" | "success" | "danger" | "muted";
}

const KIND_META: Record<NotificationKind, KindMeta> = {
  stock_bajo: { label: "Stock bajo", icon: "📦", variant: "coral" },
  vencimiento: { label: "Vencimiento", icon: "⏰", variant: "warning" },
  nuevo_pedido: { label: "Nuevo pedido", icon: "🛒", variant: "primary" },
};

/** Devuelve un texto relativo del tipo "hace 2 horas". */
function timeAgo(iso: string): string {
  const diffSec = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diffSec < 60) return `hace ${diffSec}s`;
  const m = Math.floor(diffSec / 60);
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} día${d === 1 ? "" : "s"}`;
}

// Al montar, le pedimos al backend que sincronice las notificaciones de
// stock bajo y vencimientos antes de listar. Así el centro siempre muestra
// la realidad actual del catálogo sin depender de un cron job aparte.
async function syncAndList() {
  if (!USE_MOCK) {
    try {
      await api.post("/notifications/sync");
    } catch {
      // Si falla la sync, seguimos mostrando lo que haya.
    }
  }
  return notificationService.list();
}

export default function AdminNotificationsPage() {
  const { data: notifications, refetch } = useAsync(syncAndList, []);
  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [kindFilter, setKindFilter] = useState<NotificationKind | "all">("all");

  const counts = useMemo(
    () => ({
      total: (notifications ?? []).length,
      unread: (notifications ?? []).filter((n) => !n.read).length,
      stock: (notifications ?? []).filter((n) => n.kind === "stock_bajo").length,
      pedidos: (notifications ?? []).filter((n) => n.kind === "nuevo_pedido").length,
    }),
    [notifications]
  );

  const filtered = useMemo(() => {
    return (notifications ?? []).filter((n) => {
      if (readFilter === "unread" && n.read) return false;
      if (readFilter === "read" && !n.read) return false;
      if (kindFilter !== "all" && n.kind !== kindFilter) return false;
      return true;
    });
  }, [notifications, readFilter, kindFilter]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      void refetch();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = (notifications ?? []).filter((n) => !n.read);
    await Promise.all(unread.map((n) => notificationService.markAsRead(n.id)));
    toast.success(`${unread.length} notificaciones marcadas como leídas`);
    void refetch();
  };

  return (
    <>
      <PageHeader
        title="Centro de notificaciones"
        subtitle="Mantente al día con las alertas del sistema"
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={counts.unread === 0}
          >
            ✓ Marcar todas como leídas
          </Button>
        }
      />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total" value={counts.total} icon="🔔" />
        <StatCard
          label="No leídas"
          value={counts.unread}
          icon="🆕"
          variant="coral"
          delta={
            counts.unread > 0
              ? { value: "Requieren atención", positive: false }
              : undefined
          }
        />
        <StatCard label="Stock bajo" value={counts.stock} icon="📦" variant="warning" />
        <StatCard label="Nuevos pedidos" value={counts.pedidos} icon="🛒" variant="success" />
      </section>

      <div className="flex flex-wrap gap-3 mb-5 items-center">
        <div className="flex gap-2">
          <Chip active={readFilter === "all"} onClick={() => setReadFilter("all")}>
            Todas
          </Chip>
          <Chip active={readFilter === "unread"} onClick={() => setReadFilter("unread")}>
            No leídas ({counts.unread})
          </Chip>
          <Chip active={readFilter === "read"} onClick={() => setReadFilter("read")}>
            Leídas
          </Chip>
        </div>

        <div className="h-6 w-px bg-border" />

        <div className="flex gap-2 flex-wrap">
          <Chip active={kindFilter === "all"} onClick={() => setKindFilter("all")}>
            Todos los tipos
          </Chip>
          {(Object.keys(KIND_META) as NotificationKind[]).map((k) => (
            <Chip key={k} active={kindFilter === k} onClick={() => setKindFilter(k)}>
              {KIND_META[k].icon} {KIND_META[k].label}
            </Chip>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader
          title="Bandeja"
          subtitle={`${filtered.length} notificación${filtered.length === 1 ? "" : "es"}`}
        />
        {filtered.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="¡Todo al día!"
            description="No hay notificaciones que coincidan con el filtro."
          />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((n) => (
              <NotificationRow key={n.id} notification={n} onMarkAsRead={handleMarkAsRead} />
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Fila individual de notificación                                            */
/* -------------------------------------------------------------------------- */

interface NotificationRowProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

function NotificationRow({ notification, onMarkAsRead }: NotificationRowProps) {
  const meta = KIND_META[notification.kind];
  return (
    <li
      className={cn(
        "flex items-start gap-4 py-4 px-1 transition-colors",
        !notification.read && "bg-primary-50/30"
      )}
    >
      <div className="w-10 h-10 rounded-xl bg-primary-50 grid place-items-center text-lg flex-shrink-0">
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4
            className={cn(
              "text-sm font-semibold",
              notification.read ? "text-text-muted" : "text-text"
            )}
          >
            {notification.title}
          </h4>
          <Badge variant={meta.variant}>{meta.label}</Badge>
          {!notification.read && (
            <span className="text-[10px] uppercase tracking-wide font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-full">
              Nuevo
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-sm leading-relaxed",
            notification.read ? "text-text-muted" : "text-text"
          )}
        >
          {notification.message}
        </p>
        <div className="text-xs text-text-muted mt-1">{timeAgo(notification.createdAt)}</div>
      </div>
      {!notification.read && (
        <Button size="sm" variant="ghost" onClick={() => onMarkAsRead(notification.id)}>
          Marcar leída
        </Button>
      )}
    </li>
  );
}
