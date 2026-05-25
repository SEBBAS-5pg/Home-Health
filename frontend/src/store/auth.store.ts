import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Role, User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
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
      hydrated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("hh_token");
          } catch {}
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (data) =>
        set((state) => (state.user ? { user: { ...state.user, ...data } } : state)),
    }),
    {
      name: "hh-auth",
      onRehydrateStorage: () => (state) => {
        // Marca que la persistencia ya se rehidrató usando el state que
        // recibe onRehydrateStorage (no usar set() aquí)
        if (state) {
          (state as AuthState).hydrated = true;
        }
      },
    }
  )
);

export const getRole = (): Role | null =>
  useAuthStore.getState().user?.role ?? null;
