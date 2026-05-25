import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthListener from "../components/AuthListener";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home-Health · Gestión farmacéutica",
  description: "Sistema web de gestión de inventario y pedidos para farmacias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.variable}>
      <body>
        <AuthListener />
        {children}
      </body>
    </html>
  );
}
