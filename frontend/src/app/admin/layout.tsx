import { ReactNode } from "react";
import { AdminShell } from "@/components/layout/AdminShell";
import { ToastContainer } from "@/hooks/useToast";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminShell>{children}</AdminShell>
      <ToastContainer />
    </>
  );
}
