"use client";

import { useEffect, useState } from "react";
import { userService } from "@/services";
import { toast } from "@/hooks/useToast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ProfilePage() {
  const [original, setOriginal] = useState({ fullName: "", phone: "" });
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void userService.getCurrent().then((u) => {
      if (!u) return;
      setForm({ fullName: u.fullName, email: u.email, phone: u.phone });
      setOriginal({ fullName: u.fullName, phone: u.phone });
    });
  }, []);

  const hasChanges =
    form.fullName !== original.fullName || form.phone !== original.phone;

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info("No hay cambios para guardar");
      return;
    }
    setSubmitting(true);
    try {
      // El backend trata `/users/me` distinto que `/users/:id`. Pasamos "me".
      await userService.updateProfile("me", {
        fullName: form.fullName,
        phone: form.phone,
      });
      setOriginal({ fullName: form.fullName, phone: form.phone });
      toast.success("Perfil actualizado correctamente");
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message ?? "No se pudo actualizar el perfil";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader title="Mi perfil" subtitle="Mantén tu información de contacto al día" />

      <div className="max-w-2xl">
        <Card>
          <CardHeader title="Datos personales" subtitle="Solo nombre y teléfono son editables" />
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" value={form.email} disabled />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setForm({ ...form, ...original })}>
              Descartar
            </Button>
            <Button onClick={handleSave} disabled={submitting}>
              {submitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
}
