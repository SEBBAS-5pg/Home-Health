"use client";

import { useAuthStore } from "@/store/auth.store";

// Vista del usuario actual para sidebar/header.
// Pasa de `cliente`/`administrador` (modelo) a `Cliente`/`Admin` (UI)
// y calcula las iniciales (KC, AG, ...) en un solo lugar.
export interface CurrentUserView {
  name: string;
  fullName: string;
  email: string;
  role: "Cliente" | "Admin";
  isAuthenticated: boolean;
}

const initialsOf = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "?";
};

export function useCurrentUser(): CurrentUserView {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!user) {
    return {
      name: "?",
      fullName: "Invitado",
      email: "",
      role: "Cliente",
      isAuthenticated: false,
    };
  }

  return {
    name: initialsOf(user.fullName),
    fullName: user.fullName,
    email: user.email,
    role: user.role === "administrador" ? "Admin" : "Cliente",
    isAuthenticated,
  };
}
