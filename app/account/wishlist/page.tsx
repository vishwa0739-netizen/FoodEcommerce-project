// app/account/wishlist/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WishlistCard } from "@/components/account/WishlistCard";
import { HeartOff } from "lucide-react";
import type { WishlistItem } from "@/lib/types";

export default function WishlistPage() {
  const supabase = createClient();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Adjust this select to match your schema — e.g. if wishlist stores
      // only product_id, join against your products table instead.
      const { data } = await supabase
        .from("wishlist")
        .select("id, product_id, name, price, image_emoji")
        .eq("user_id", user.id);

      setItems(data ?? []);
      setIsLoading(false);
    }
    load();
  }, [supabase]);

  async function handleRemove(id: string) {
    await supabase.from("wishlist").delete().eq("id", id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleAddToCart(item: WishlistItem) {
    // Wire this up to your cart store / Cart Drawer component.
    console.log("Add to cart:", item);
  }

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between px-16 desktop:px-0 pt-20 desktop:pt-0 pb-3">
        <h1 className="font-display text-xl italic text-ink-primary">
          Wishlist{" "}
          <span className="font-mono text-sm text-ink-muted font-normal not-italic">
            {items.length}
          </span>
        </h1>
        {items.length > 0 && (
          <button className="text-xs font-semibold text-wine">Add all to cart</button>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 desktop:grid-cols-4 gap-2.5 px-16 desktop:px-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[180px] rounded-lg bg-wine/[0.04] animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-48">
          <HeartOff size={32} className="text-ink-muted mb-3" />
          <p className="text-sm font-medium text-ink-secondary">Your wishlist is empty</p>
          <p className="text-xs text-ink-muted mt-1">Items you save will show up here.</p>
        </div>
      )}

      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-2.5 px-16 desktop:px-0">
        {items.map((item) => (
          <WishlistCard
            key={item.id}
            item={item}
            onRemove={handleRemove}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
}