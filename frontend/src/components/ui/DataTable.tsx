import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  width?: string;
  align?: "left" | "right" | "center";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
}

// Tabla genérica. Cada página le pasa sus columnas (`Column<T>[]`)
// y la tabla solo se encarga de pintar header, filas y vacío.
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyState,
  onRowClick,
}: DataTableProps<T>) {
  if (rows.length === 0 && emptyState) {
    return <div className="bg-surface border border-border rounded-2xl">{emptyState}</div>;
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={col.width ? { width: col.width } : undefined}
                className={cn(
                  "text-[11px] uppercase tracking-wider font-semibold text-text-muted bg-bg border-b border-border px-4 py-3",
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  (!col.align || col.align === "left") && "text-left"
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "border-b border-border-light last:border-b-0 transition-colors",
                onRowClick && "cursor-pointer hover:bg-primary-50/40"
              )}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn(
                    "px-4 py-3.5 text-sm text-text",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
