import { ReactNode } from "react";

interface AuthLayoutProps {
  /** Hero (lado izquierdo) */
  headline: string;
  description: string;
  features?: string[];
  /** Formulario (lado derecho) */
  children: ReactNode;
}

export function AuthLayout({
  headline,
  description,
  features = [],
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Lado izquierdo - hero turquesa */}
      <aside className="relative bg-gradient-to-br from-primary-500 to-cyan-600 text-white p-12 lg:p-16 hidden lg:flex flex-col justify-between overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute top-20 right-16 w-48 h-48 rounded-full bg-coral-400/30" />

        <div className="relative z-10 flex items-center gap-3 font-bold">
          <div className="w-11 h-11 rounded-xl bg-white text-primary-700 grid place-items-center font-extrabold text-lg">
            +H
          </div>
          <span className="text-lg">Home-Health</span>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold leading-tight mb-3">
            {headline}
          </h1>
          <p className="text-base opacity-90 max-w-md leading-relaxed">
            {description}
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-3">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-3 text-[13px] opacity-95">
              <div className="w-6 h-6 rounded-full bg-white/20 grid place-items-center text-xs">
                ✓
              </div>
              {f}
            </div>
          ))}
        </div>
      </aside>

      {/* Lado derecho - formulario */}
      <main className="flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
