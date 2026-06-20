// components/ui/StatusBadge.tsx
import { cn } from "@/lib/utils";

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

const statusStyles: Record<OrderStatus, string> = {
  processing: "bg-[#fef3cd] text-[#8a6500]",
  shipped: "bg-[#dbeafe] text-[#1e40af]",
  delivered: "bg-[#dcfce7] text-[#166534]",
  cancelled: "bg-[#fee2e2] text-[#991b1b]",
};

const statusLabels: Record<OrderStatus, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] font-medium tracking-[0.3px] shrink-0",
        statusStyles[status]
      )}
    >
      {statusLabels[status]}
    </span>
  );
}