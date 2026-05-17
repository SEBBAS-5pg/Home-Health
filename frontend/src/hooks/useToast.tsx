"use client";

import { create } from "zustand";

type ToastVariant = "success" | "error" | "info";
interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, variant?: ToastVariant) => void;
  dismiss: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, variant = "info") =>
    set((state) => {
      const id = `t-${Date.now()}-${Math.random()}`;
      setTimeout(() => {
        useToastStore.getState().dismiss(id);
      }, 3500);
      return { toasts: [...state.toasts, { id, message, variant }] };
    }),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  info: "bg-primary-500",
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl text-white text-sm shadow-lg font-medium ${variantStyles[t.variant]}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export const toast = {
  success: (msg: string) => useToastStore.getState().show(msg, "success"),
  error: (msg: string) => useToastStore.getState().show(msg, "error"),
  info: (msg: string) => useToastStore.getState().show(msg, "info"),
};
