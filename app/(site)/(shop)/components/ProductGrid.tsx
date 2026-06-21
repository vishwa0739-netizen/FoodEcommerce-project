"use client";

// ─────────────────────────────────────────────
//  CraftNest — ProductGrid
//  2 cols mobile | 3 tablet | 4 desktop
//  Infinite scroll + "Load more" fallback
//  Skeleton loaders | Empty state | No-results state
// ─────────────────────────────────────────────

import { useCallback } from "react";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { useIntersectionObserver } from "../hooks";
import type { Product } from "../types";

// ── Empty / No Results States ─────────────────
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-[#F3EFE9] flex items-center justify-center mb-5">
        <svg
          className="w-9 h-9 text-[#bf8952]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      <h2 className="text-xl font-['Fraunces'] font-semibold text-[#1A1108] mb-2">
        Nothing here yet
      </h2>
      <p className="text-sm font-['Plus_Jakarta_Sans'] text-[#9A8E80] max-w-xs">
        This category is still being curated. Check back soon for handpicked
        products.
      </p>
    </div>
  );
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-[#F3EFE9] flex items-center justify-center mb-5">
        <svg
          className="w-9 h-9 text-[#9A8E80]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
      <h2 className="text-xl font-['Fraunces'] font-semibold text-[#1A1108] mb-2">
        No results for &ldquo;{query}&rdquo;
      </h2>
      <p className="text-sm font-['Plus_Jakarta_Sans'] text-[#9A8E80] max-w-xs">
        Try different keywords or remove filters to see more products.
      </p>
    </div>
  );
}

// ── Load More Button ──────────────────────────
function LoadMoreButton({
  isLoading,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) {
  return (
    <div className="col-span-full flex justify-center pt-4 pb-8">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="
          h-11 px-8 rounded-xl border border-[#D9D3C7]
          text-sm font-['Plus_Jakarta_Sans'] font-medium text-[#3D2B1F]
          hover:border-[#bf8952] hover:text-[#691626]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          flex items-center gap-2
        "
      >
        {isLoading ? (
          <>
            <svg
              className="w-4 h-4 animate-spin text-[#bf8952]"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth={3}
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Loading…
          </>
        ) : (
          "Load more"
        )}
      </button>
    </div>
  );
}

// ── Infinite scroll sentinel ──────────────────
function ScrollSentinel({ onVisible }: { onVisible: () => void }) {
  const ref = useIntersectionObserver(onVisible, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  return <div ref={ref} className="col-span-full h-1" aria-hidden="true" />;
}

// ── Main ProductGrid ──────────────────────────
interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  searchQuery: string;
  onLoadMore: () => void;
  onWishlistToggle?: (id: string, next: boolean) => void;
}

const SKELETON_COUNT = 8;

export function ProductGrid({
  products,
  isLoading,
  isLoadingMore,
  hasMore,
  searchQuery,
  onLoadMore,
  onWishlistToggle,
}: ProductGridProps) {
  const isEmpty = !isLoading && products.length === 0;
  const hasNoResults = isEmpty && searchQuery.length > 0;
  const hasTrueEmpty = isEmpty && searchQuery.length === 0;

  // Use intersection observer for auto infinite scroll
  // with load-more button as fallback
  const handleSentinelVisible = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      onLoadMore();
    }
  }, [isLoadingMore, hasMore, onLoadMore]);

  return (
    <div
      className="
        grid gap-3
        grid-cols-2
        sm:grid-cols-3
        xl:grid-cols-4
      "
    >
      {/* Skeleton loaders */}
      {isLoading &&
        Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <ProductCardSkeleton key={`sk-${i}`} />
        ))}

      {/* Product cards */}
      {!isLoading &&
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onWishlistToggle={onWishlistToggle}
          />
        ))}

      {/* Empty / No-results states */}
      {hasTrueEmpty && <EmptyState />}
      {hasNoResults && <NoResultsState query={searchQuery} />}

      {/* Loading more skeletons */}
      {isLoadingMore &&
        Array.from({ length: 4 }, (_, i) => (
          <ProductCardSkeleton key={`sk-more-${i}`} />
        ))}

      {/* Intersection sentinel (auto infinite scroll) */}
      {!isLoading && hasMore && !isLoadingMore && (
        <ScrollSentinel onVisible={handleSentinelVisible} />
      )}

      {/* Load More button fallback */}
      {!isLoading && hasMore && (
        <LoadMoreButton isLoading={isLoadingMore} onClick={onLoadMore} />
      )}

      {/* End of results */}
      {!isLoading && !hasMore && products.length > 0 && (
        <div className="col-span-full text-center py-6">
          <span className="text-xs font-['DM_Mono'] text-[#9A8E80] tracking-widest uppercase">
            — All products loaded —
          </span>
        </div>
      )}
    </div>
  );
}