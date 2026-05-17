import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role, User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (data) =>
        set((state) => (state.user ? { user: { ...state.user, ...data } } : state)),
    }),
    { name: "hh-auth" }
  )
);

export const getRole = (): Role | null =>
  useAuthStore.getState().user?.role ?? null;
