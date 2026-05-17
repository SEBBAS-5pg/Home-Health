import { redirect } from "next/navigation";

export default function HomePage() {
  // Por defecto redirigimos al login. Más adelante, si hay sesión, redirigiremos
  // al catálogo (cliente) o al dashboard (admin) según el rol.
  redirect("/login");
}
