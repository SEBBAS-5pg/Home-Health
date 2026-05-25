"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthListener() {
  const router = useRouter();

  useEffect(() => {
    const onLogout = () => {
      router.push("/login");
    };

    window.addEventListener("hh:logout", onLogout);
    return () => window.removeEventListener("hh:logout", onLogout);
  }, [router]);

  return null;
}
