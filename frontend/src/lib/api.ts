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

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("hh_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("hh_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// `true` mientras no haya backend. Cambiar a `false` en .env.local
// (NEXT_PUBLIC_USE_MOCK=false) cuando se conecte la API real.
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
