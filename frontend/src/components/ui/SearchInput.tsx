"use client";

import { ChangeEvent } from "react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative flex-1 min-w-[240px]", className)}>
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-soft text-sm pointer-events-none">
        🔍
      </span>
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-border bg-white text-sm placeholder:text-text-soft focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-500"
      />
    </div>
  );
}
