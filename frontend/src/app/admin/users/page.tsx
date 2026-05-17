"use client";

// HU05 — listado de usuarios con búsqueda y filtro por rol.
import { useMemo, useState } from "react";
import { Role, User } from "@/types";
import { userService } from "@/services";
import { useAsync } from "@/hooks/useAsync";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Chip } from "@/components/ui/Chip";
import { DataTable, Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/features/dashboard/StatCard";

type RoleFilter = "all" | Role;

const ROLE_FILTERS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "cliente", label: "Clientes" },
  { value: "administrador", label: "Administradores" },
];

/** Devuelve las iniciales para el avatar (ej. "María Pérez" → "MP"). */
function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminUsersPage() {
  const { data: users } = useAsync(() => userService.list(), []);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    return (users ?? []).filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
      );
    });
  }, [users, debouncedQuery, roleFilter]);

  const counts = useMemo(
    () => ({
      total: (users ?? []).length,
      clientes: (users ?? []).filter((u) => u.role === "cliente").length,
      administradores: (users ?? []).filter((u) => u.role === "administrador").length,
    }),
    [users]
  );

  const columns: Column<User>[] = [
    {
      key: "user",
      header: "Usuario",
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar initials={getInitials(u.fullName)} />
          <div>
            <div className="font-semibold">{u.fullName}</div>
            <div className="text-xs text-text-muted">{u.email}</div>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Teléfono", render: (u) => u.phone },
    {
      key: "role",
      header: "Rol",
      render: (u) =>
        u.role === "administrador" ? (
          <Badge variant="primary">Administrador</Badge>
        ) : (
          <Badge variant="muted">Cliente</Badge>
        ),
    },
    {
      key: "createdAt",
      header: "Registrado",
      render: (u) => formatDate(u.createdAt),
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <div className="flex gap-1 justify-end">
          <Button size="sm" variant="ghost">Ver detalle</Button>
        </div>
      ),
      align: "right",
    },
  ];

  return (
    <>
      <PageHeader
        title="Gestión de usuarios"
        subtitle="Administra los usuarios registrados en la plataforma"
        actions={<Button variant="secondary" size="sm">⬇ Exportar listado</Button>}
      />

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Usuarios totales" value={counts.total} icon="👥" />
        <StatCard label="Clientes" value={counts.clientes} icon="🧑" variant="success" />
        <StatCard
          label="Administradores"
          value={counts.administradores}
          icon="🛠"
          variant="warning"
        />
      </section>

      <div className="flex flex-wrap gap-3 mb-5">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Buscar por nombre, email o teléfono..."
        />
        <div className="flex gap-2">
          {ROLE_FILTERS.map((r) => (
            <Chip
              key={r.value}
              active={roleFilter === r.value}
              onClick={() => setRoleFilter(r.value)}
            >
              {r.label}
            </Chip>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon="🔎"
            title="Sin resultados"
            description="No se encontraron usuarios con esos criterios. Prueba otra búsqueda."
          />
        ) : (
          <DataTable columns={columns} rows={filtered} rowKey={(u) => u.id} />
        )}
      </Card>
    </>
  );
}
