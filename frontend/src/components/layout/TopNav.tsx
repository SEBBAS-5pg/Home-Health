// Variante compacta del encabezado de página.
// Si solo necesitas un título + subtítulo + acciones a la derecha sin separador,
// usa este en lugar de <PageHeader />.
import { ReactNode } from "react";

interface TopNavProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export function TopNav({ title, subtitle, right }: TopNavProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div>
        <h1 className="text-[22px] font-bold text-text leading-tight">{title}</h1>
        {subtitle && (
          <div className="text-sm text-text-muted mt-0.5">{subtitle}</div>
        )}
      </div>
      {right && <div className="ml-auto flex items-center gap-2.5">{right}</div>}
    </div>
  );
}
