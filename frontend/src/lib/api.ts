// Cliente HTTP del proyecto.
//
// Hoy los services corren en modo mock (datos en memoria) porque
// el backend todavía no existe. Cuando el backend esté listo y se ponga
// NEXT_PUBLIC_USE_MOCK=false en el .env, los services pasarán a usar
// este cliente para hacer las llamadas reales.
//
// El token JWT se adjunta automáticamente desde localStorage y si el
// backend responde 401 se cierra sesión y se vuelve a /login.
import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== "undefined") {
      const { useAuthStore } = await import("../store/auth.store");
      const storeToken = useAuthStore.getState().token;
      const fallback = localStorage.getItem("hh_token");
      const token = storeToken || fallback;
      if (token) {
        if (!config.headers) {
          // initialize headers with a type-safe empty object for Axios
          config.headers = {} as any;
        }
        // assign Authorization header without replacing the headers object
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      try {
        if (typeof window !== "undefined") {
          import("../store/auth.store").then((m) => m.useAuthStore.getState().logout()).catch(() => {});
          try {
            window.dispatchEvent(new Event("hh:logout"));
          } catch (e) {}
        }
      } catch (e) {}
    }
    return Promise.reject(error);
  }
);

// `true` mientras no haya backend. Cambiar a `false` en .env.local
// (NEXT_PUBLIC_USE_MOCK=false) cuando se conecte la API real.
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
