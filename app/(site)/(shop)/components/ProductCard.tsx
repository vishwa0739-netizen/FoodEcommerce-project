"use client";

// ─────────────────────────────────────────────
//  CraftNest — ProductCard + ProductCardSkeleton
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "../types";

// ── Star Rating ────────────────────────────────
function StarRating({ rating, count }: { rating: number; count: number }) {
  const filled = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, i) => {
          const isFilled = i < filled;
          const isHalf = !isFilled && i === filled && hasHalf;
          return (
            <svg
              key={i}
              className={`w-3 h-3 ${
                isFilled
                  ? "text-[#bf8952]"
                  : isHalf
                  ? "text-[#bf8952]"
                  : "text-[#D9D3C7]"
              }`}
              viewBox="0 0 20 20"
              fill={isFilled ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={isFilled || isHalf ? 0 : 1.5}
            >
              {isHalf ? (
                <>
                  <defs>
                    <linearGradient id={`half-${i}`}>
                      <stop offset="50%" stopColor="currentColor" />
                      <stop
                        offset="50%"
                        stopColor="transparent"
                        stopOpacity="1"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    fill={`url(#half-${i})`}
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </>
              ) : (
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              )}
            </svg>
          );
        })}
      </div>
      <span className="text-[10px] text-[#9A8E80] font-['DM_Mono'] leading-none">
        ({count})
      </span>
    </div>
  );
}

// ── Badge ─────────────────────────────────────
function ProductBadge({
  badge,
  badgePercent,
}: {
  badge: string;
  badgePercent?: number;
}) {
  const isDiscount = badgePercent !== undefined;

  return (
    <span
      className={`
        absolute top-2 left-2 z-10
        px-2 py-0.5 rounded-full text-[10px] font-['DM_Mono'] font-medium tracking-wide
        ${
          isDiscount
            ? "bg-[#691626] text-[#FCFCF7]"
            : badge === "New"
            ? "bg-[#bf8952] text-[#FCFCF7]"
            : badge === "Bestseller"
            ? "bg-[#2C1810] text-[#FCFCF7]"
            : badge === "Limited"
            ? "bg-[#4A3728] text-[#FCFCF7]"
            : "bg-[#E8E4DC] text-[#3D2B1F]"
        }
      `}
    >
      {isDiscount ? `${badgePercent}%` : badge}
    </span>
  );
}

// ── Wishlist Button ───────────────────────────
function WishlistButton({
  isWishlisted,
  onToggle,
}: {
  isWishlisted: boolean;
  onToggle: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className="
        absolute top-2 right-2 z-10
        w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm
        flex items-center justify-center
        shadow-sm
        transition-transform duration-150 active:scale-90
      "
    >
      <svg
        className={`w-4 h-4 transition-colors duration-200 ${
          isWishlisted ? "text-[#691626]" : "text-[#9A8E80]"
        }`}
        viewBox="0 0 24 24"
        fill={isWishlisted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

// ── Main ProductCard ──────────────────────────
interface ProductCardProps {
  product: Product;
  onWishlistToggle?: (id: string, next: boolean) => void;
}

export function ProductCard({ product, onWishlistToggle }: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(
    product.isWishlisted ?? false
  );
  const [imgError, setImgError] = useState(false);

  const handleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const next = !wishlisted;
      setWishlisted(next);
      onWishlistToggle?.(product.id, next);
    },
    [wishlisted, product.id, onWishlistToggle]
  );

  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : undefined;

  const displayBadge = product.badge;
  const displayBadgePercent = discountPercent ?? product.badgePercent;

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.currency || "INR",
    maximumFractionDigits: 0,
  }).format(product.price);

  const formattedOriginal = product.originalPrice
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: product.currency || "INR",
        maximumFractionDigits: 0,
      }).format(product.originalPrice)
    : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-shadow duration-300"
    >
      {/* Image container */}
      {/* Image container */}
<div className="relative aspect-square bg-[#F3EFE9] overflow-hidden">
  {!imgError && product.images?.[0] ? (
    <Image
      src={product.images[0]}
      alt={product.name}
      fill
      sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setImgError(true)}
    />
  ) : (
    // Fallback placeholder — now also covers "no image yet"
    <div className="w-full h-full flex items-center justify-center">
      <svg
        className="w-12 h-12 text-[#D9D3C7]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  )}
  ...

        {/* Badge */}
        {displayBadge && (
          <ProductBadge
            badge={displayBadge}
            badgePercent={displayBadgePercent}
          />
        )}

        {/* Wishlist */}
        <WishlistButton isWishlisted={wishlisted} onToggle={handleWishlist} />

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-end justify-center pb-3">
            <span className="text-[11px] font-['DM_Mono'] text-[#9A8E80] tracking-wider uppercase">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3">
        {/* Brand */}
        <span className="text-[10px] font-['Plus_Jakarta_Sans'] text-[#9A8E80] uppercase tracking-widest truncate">
          {product.brand}
        </span>

        {/* Name */}
        <p className="text-sm font-['Fraunces'] text-[#1A1108] leading-snug line-clamp-2 font-medium">
          {product.name}
        </p>

        {/* Rating */}
        <StarRating rating={product.rating} count={product.reviewCount} />

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-sm font-['DM_Mono'] font-medium text-[#691626]">
            {formattedPrice}
          </span>
          {formattedOriginal && (
            <span className="text-[11px] font-['DM_Mono'] text-[#9A8E80] line-through">
              {formattedOriginal}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── ProductCardSkeleton ───────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      {/* Image skeleton */}
      <div className="relative aspect-square bg-[#EDEAE4] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
      </div>

      {/* Text skeletons */}
      <div className="flex flex-col gap-2 p-3">
        <div className="h-2.5 w-14 rounded-full bg-[#EDEAE4] overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
        </div>
        <div className="h-4 w-full rounded-full bg-[#EDEAE4] overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
        </div>
        <div className="h-3 w-3/4 rounded-full bg-[#EDEAE4] overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
        </div>
        <div className="h-4 w-20 rounded-full bg-[#EDEAE4] mt-1 overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_1.5s_infinite] bg-[length:200%_100%]" />
        </div>
      </div>
    </div>
  );
}