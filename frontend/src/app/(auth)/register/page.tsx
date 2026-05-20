"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { registerSchema, RegisterInput } from "@/lib/validators";
import { api, USE_MOCK } from "@/lib/api";
import { toast } from "@/hooks/useToast";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 700));
      } else {
        await api.post("/auth/register", {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          password: data.password,
        });
      }
      toast.success("¡Cuenta creada! Ya puedes iniciar sesión.");
      router.push("/login");
    } catch (err: any) {
      // Mostramos exactamente lo que vino del backend.
      const msg =
        err?.response?.data?.error?.message ??
        err?.response?.data?.message ??
        err?.message ??
        "No se pudo crear la cuenta. Intenta de nuevo.";
      toast.error(msg);
    }
  };

  return (
    <AuthLayout
      headline="Crea tu cuenta en menos de un minuto."
      description="Únete a Home-Health y comienza a hacer tus pedidos con seguimiento en tiempo real."
      features={[
        "Acceso al catálogo completo",
        "Historial de tus pedidos",
        "Información segura y cifrada",
      ]}
    >
      <h2 className="text-[26px] font-bold mb-1.5">Crear cuenta</h2>
      <p className="text-text-muted mb-7 text-sm">
        Completa tus datos para registrarte como cliente
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="fullName" required>Nombre completo</Label>
          <Input
            id="fullName"
            placeholder="María Pérez"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <Label htmlFor="email" required>Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
          <div>
            <Label htmlFor="phone" required>Teléfono</Label>
            <Input
              id="phone"
              placeholder="+57 300 000 0000"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          <div>
            <Label htmlFor="password" required>Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mín. 8 caracteres"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
          <div>
            <Label htmlFor="confirmPassword" required>Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite la contraseña"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
          </div>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <div className="mt-5 text-center text-[13px] text-text-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary-700 font-semibold hover:underline">
          Iniciar sesión
        </Link>
      </div>
    </AuthLayout>
  );
}
