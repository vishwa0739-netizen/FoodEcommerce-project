// components/account/OrderFilterPills.tsx
"use client";

import { cn } from "@/lib/utils";

export type OrderFilter = "all" | "active" | "delivered" | "cancelled";

interface OrderFilterPillsProps {
  active: OrderFilter;
  counts: Record<OrderFilter, number>;
  onChange: (filter: OrderFilter) => void;
}

const filters: { key: OrderFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

export function OrderFilterPills({ active, counts, onChange }: OrderFilterPillsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-3 -mx-1 px-1">
      {filters.map((f) => (
        <button
          key={f.key}
          onClick={() => onChange(f.key)}
          className={cn(
            "px-3.5 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-colors shrink-0",
            active === f.key
              ? "bg-wine border-wine text-white"
              : "border-[var(--border-strong)] text-ink-secondary hover:border-wine"
          )}
        >
          {f.label} ({counts[f.key]})
        </button>
      ))}
    </div>
  );
}