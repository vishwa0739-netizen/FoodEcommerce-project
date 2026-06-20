// components/account/WishlistCard.tsx
"use client";

import { Heart } from "lucide-react";
import type { WishlistItem } from "@/lib/types";

interface WishlistCardProps {
  item: WishlistItem;
  onRemove: (id: string) => void;
  onAddToCart: (item: WishlistItem) => void;
}

export function WishlistCard({ item, onRemove, onAddToCart }: WishlistCardProps) {
  return (
    <div className="bg-white border border-[var(--border-subtle)] rounded-lg overflow-hidden">
      <div className="h-[100px] bg-gradient-to-br from-gold-pale to-[#e8cfaa] flex items-center justify-center text-[36px] relative">
        {item.image_emoji ?? "🍽️"}
        <button
          onClick={() => onRemove(item.id)}
          aria-label="Remove from wishlist"
          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center"
        >
          <Heart size={14} className="fill-wine text-wine" />
        </button>
      </div>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-ink-primary leading-snug mb-0.5 line-clamp-2">
          {item.name}
        </p>
        <p className="font-mono text-[13px] text-wine font-medium">
          ₹{item.price.toLocaleString("en-IN")}
        </p>
        <button
          onClick={() => onAddToCart(item)}
          className="w-full mt-2 h-8 bg-wine rounded-md text-white text-[11px] font-semibold hover:bg-wine-dark transition-colors"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}