"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { loginSchema, LoginInput } from "@/lib/validators";
import { useAuthStore } from "@/store/auth.store";
import { Role, User } from "@/types";

/**
 * MOCK auth: hasta integrar el backend, derivamos el rol por convención
 * sobre el email (`admin*@…` → administrador). El authStore se llena con
 * un User completo y un token simulado, así toda la UI (Sidebar, Header,
 * guards) puede leer del store sin acoplarse a la página de login.
 */
const buildMockUser = (email: string): { user: User; token: string } => {
  const role: Role = email.toLowerCase().includes("admin")
    ? "administrador"
    : "cliente";
  const fullName = role === "administrador" ? "Admin Demo" : "Cliente Demo";
  return {
    user: {
      id: `mock-${role}`,
      fullName,
      email,
      phone: "",
      role,
      createdAt: new Date().toISOString(),
    },
    token: `mock-token-${Date.now()}`,
  };
};

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    // TODO: integrar con backend real
    // const res = await api.post("/auth/login", data)
    await new Promise((r) => setTimeout(r, 400));

    const { user, token } = buildMockUser(data.email);
    login(user, token);
    if (typeof window !== "undefined") {
      localStorage.setItem("hh_token", token);
    }

    router.push(user.role === "administrador" ? "/admin/dashboard" : "/catalog");
  };

  return (
    <AuthLayout
      headline="Salud y bienestar al alcance de un clic."
      description="Gestiona tu farmacia, controla tu inventario y atiende a tus clientes desde una sola plataforma sencilla y segura."
      features={[
        "Catálogo organizado por categorías",
        "Pedidos en tiempo real",
        "Control de stock y vencimientos",
      ]}
    >
      <h2 className="text-[26px] font-bold mb-1.5">Bienvenido de nuevo 👋</h2>
      <p className="text-text-muted mb-7 text-sm">
        Inicia sesión para continuar con tu cuenta
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div>
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <div className="flex justify-between items-center text-[13px] text-text-muted pt-1">
          <label className="flex gap-2 items-center cursor-pointer">
            <input type="checkbox" className="accent-primary-500" /> Recordarme
          </label>
          <Link href="#" className="text-primary-700 font-medium hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <Button type="submit" fullWidth disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Iniciando..." : "Iniciar sesión"}
        </Button>

        <p className="text-[11px] text-text-soft text-center pt-1">
          Tip demo: usa <b>admin@…</b> para entrar como administrador, cualquier
          otro correo entra como cliente.
        </p>
      </form>

      <div className="mt-5 text-center text-[13px] text-text-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="text-primary-700 font-semibold hover:underline">
          Crear cuenta
        </Link>
      </div>
    </AuthLayout>
  );
}
