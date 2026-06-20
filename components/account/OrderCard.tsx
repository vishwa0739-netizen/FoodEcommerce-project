// components/account/OrderCard.tsx
"use client";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrderProgress } from "@/components/account/OrderProgress";
import { Button } from "@/components/ui/button";
import type { Order } from "@/lib/types";

interface OrderCardProps {
  order: Order;
  onCancel?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function OrderCard({ order, onCancel, onReorder }: OrderCardProps) {
  const itemSummary =
    order.items.length === 0
      ? ""
      : order.items.length === 1
      ? order.items[0].name
      : `${order.items[0].name} +${order.items.length - 1}`;

  const primaryEmoji = order.items[0]?.image_emoji ?? "🍽️";

  return (
    <div className="bg-white border border-[var(--border-subtle)] rounded-lg mb-3 overflow-hidden">
      <div className="p-16 border-b border-[var(--border-subtle)] flex items-start justify-between gap-3">
        <div>
          <span className="block font-mono text-[11px] text-ink-muted mb-0.5">
            #{order.order_number}
          </span>
          <span className="text-sm font-semibold text-ink-primary">
            {order.items[0]?.name ?? "Order"}
          </span>
          <span className="block text-[11px] text-ink-muted mt-0.5">
            Placed {formatDate(order.created_at)}
          </span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="px-16 py-3 flex gap-3 items-center">
        <div className="w-14 h-14 rounded-sm bg-gradient-to-br from-gold-pale to-[#e8cfaa] flex items-center justify-center text-2xl shrink-0">
          {primaryEmoji}
        </div>
        <div className="flex-1">
          <div className="text-xs text-ink-muted mb-0.5">
            {order.items.length} item{order.items.length !== 1 && "s"}
          </div>
          <div className="text-sm font-medium text-ink-primary">{itemSummary}</div>
        </div>
        <div className="font-mono text-base font-medium text-wine">
          ₹{order.total.toLocaleString("en-IN")}
        </div>
      </div>

      <OrderProgress status={order.status} />

      <div className="flex gap-2 px-16 pb-16">
        {order.status === "processing" && (
          <>
            <Button variant="ghost" size="sm" onClick={() => onCancel?.(order.id)}>
              Cancel order
            </Button>
            <Button size="sm">View details</Button>
          </>
        )}
        {order.status === "shipped" && (
          <>
            <Button variant="ghost" size="sm">
              Track order
            </Button>
            <Button size="sm">View details</Button>
          </>
        )}
        {order.status === "delivered" && (
          <>
            <Button variant="ghost" size="sm">
              Write review
            </Button>
            <Button size="sm" onClick={() => onReorder?.(order.id)}>
              Reorder
            </Button>
          </>
        )}
        {order.status === "cancelled" && (
          <>
            <Button variant="ghost" size="sm">
              View details
            </Button>
            <Button size="sm" onClick={() => onReorder?.(order.id)}>
              Reorder
            </Button>
          </>
        )}
      </div>
    </div>
  );
}