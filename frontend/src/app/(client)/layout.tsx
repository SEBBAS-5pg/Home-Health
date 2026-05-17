import { ReactNode } from "react";
import { ClientShell } from "@/components/layout/ClientShell";
import { ToastContainer } from "@/hooks/useToast";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ClientShell>{children}</ClientShell>
      <ToastContainer />
    </>
  );
}
