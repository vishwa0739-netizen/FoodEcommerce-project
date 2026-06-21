// app/account/orders/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { OrderCard } from "@/components/account/OrderCard";
import { OrderFilterPills, type OrderFilter } from "@/components/account/OrderFilterPills";
import type { Order } from "@/lib/types";
import { Search, PackageX } from "lucide-react";

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<OrderFilter>("all");

  useEffect(() => {
    async function loadOrders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Adjust table/column names to match your existing schema.
      // Expecting an `orders` table with a related `order_items` table,
      // or a JSON `items` column — adapt the select() below accordingly.
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
          id,
          order_number,
          status,
          total,
          created_at,
          order_items ( id, name, quantity, image_emoji )
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(
          data.map((o: any) => ({
            id: o.id,
            order_number: o.order_number,
            status: o.status,
            total: o.total,
            created_at: o.created_at,
            items: o.order_items ?? [],
          }))
        );
      }
      setIsLoading(false);
    }

    loadOrders();
  }, [supabase]);

  const counts = useMemo(() => {
    return {
      all: orders.length,
      active: orders.filter((o) => o.status === "processing" || o.status === "shipped").length,
      delivered: orders.filter((o) => o.status === "delivered").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "active")
      return orders.filter((o) => o.status === "processing" || o.status === "shipped");
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  async function handleCancel(orderId: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (!error) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "cancelled" } : o))
      );
    }
  }

  function handleReorder(orderId: string) {
    // Wire this up to your cart logic — e.g. push order items into the cart store.
    console.log("Reorder requested for", orderId);
  }

  return (
    <div className="px-16 desktop:px-0 pb-24">
      <div className="flex items-center justify-between pt-20 desktop:pt-0 pb-2">
        <h1 className="font-display text-xl italic text-ink-primary">Your orders</h1>
        <Search size={20} className="text-ink-secondary" />
      </div>

      <OrderFilterPills active={filter} counts={counts} onChange={setFilter} />

      {isLoading && (
        <div className="space-y-3 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-lg bg-wine/[0.04] animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-48">
          <PackageX size={32} className="text-ink-muted mb-3" />
          <p className="text-sm font-medium text-ink-secondary">No orders here yet</p>
          <p className="text-xs text-ink-muted mt-1">Orders matching this filter will show up here.</p>
        </div>
      )}

      <div className="mt-2">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCancel={handleCancel}
            onReorder={handleReorder}
          />
        ))}
      </div>
    </div>
  );
}