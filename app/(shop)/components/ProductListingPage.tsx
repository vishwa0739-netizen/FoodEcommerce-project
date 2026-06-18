"use client";

// ─────────────────────────────────────────────
//  CraftNest — ProductListingPage
//  Main assembly: sticky bar, filter sidebar/drawer,
//  product grid with all states
// ─────────────────────────────────────────────

import { useState, useCallback } from "react";
import { SearchBar } from "./SearchBar";
import { FilterDrawer, SORT_OPTIONS } from "./FilterDrawer";
import { ProductGrid } from "./ProductGrid";
import {
  useFilterState,
  useProducts,
  useDebounce,
} from "../hooks";
import type { CategoryMeta } from "../types";

// ── Chip / Sort bar ───────────────────────────
function SortChips({
  currentSort,
  onSortChange,
}: {
  currentSort: string;
  onSortChange: (v: string) => void;
}) {
  // Only show 3 quick chips + "Sort" label on mobile
  const quickOptions = SORT_OPTIONS.slice(0, 4);

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5 -mx-4 px-4 sm:mx-0 sm:px-0">
      {quickOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSortChange(opt.value)}
          className={`shrink-0 h-8 px-3 rounded-full text-xs font-['Plus_Jakarta_Sans'] font-medium border transition-all duration-150 whitespace-nowrap ${
            currentSort === opt.value
              ? "bg-[#691626] text-[#FCFCF7] border-[#691626]"
              : "bg-white text-[#3D2B1F] border-[#D9D3C7] hover:border-[#bf8952]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────
interface ProductListingPageProps {
  category: CategoryMeta;
}

export default function ProductListingPage({
  category,
}: ProductListingPageProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [rawSearch, setRawSearch] = useState("");
  const searchQuery = useDebounce(rawSearch, 320);

  const {
    filters,
    pendingFilters,
    updatePending,
    applyFilters,
    clearFilters,
    activeFilterCount,
  } = useFilterState();

  const { products, isLoading, isLoadingMore, hasMore, error, loadMore } =
    useProducts(filters, searchQuery, category.slug);

  const handleSearch = useCallback((q: string) => {
    setRawSearch(q);
  }, []);

  const handleSortChange = useCallback(
    (v: string) => {
      updatePending("sort", v as typeof filters.sort);
      // Apply immediately for sort — feels snappier
      applyFilters();
    },
    [updatePending, applyFilters]
  );

  return (
    <div className="min-h-screen bg-[#FCFCF7]">
      {/* ── Sticky top bar ──────────────────── */}
      <div className="sticky top-0 z-40 bg-[#FCFCF7]/90 backdrop-blur-md border-b border-[#E8E4DC]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-14">
            {/* Filter toggle (mobile + tablet) */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-xl bg-white border border-[#D9D3C7] text-sm font-['Plus_Jakarta_Sans'] text-[#3D2B1F] hover:border-[#bf8952] transition-colors"
              aria-label="Open filters"
            >
              <svg
                className="w-4 h-4 text-[#9A8E80]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="12" y1="18" x2="12" y2="18" />
              </svg>
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#691626] text-[#FCFCF7] text-[9px] font-['DM_Mono'] flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort chips (hidden on desktop — sidebar handles it) */}
            <div className="lg:hidden flex-1 min-w-0">
              <SortChips
                currentSort={filters.sort}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Search bar */}
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* ── Page content ──────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-['Fraunces'] font-semibold text-[#1A1108] mb-1">
            {category.title}
          </h1>
          {category.description && (
            <p className="text-sm font-['Plus_Jakarta_Sans'] text-[#9A8E80]">
              {category.description}
            </p>
          )}
          {category.productCount !== undefined && !isLoading && (
            <p className="text-xs font-['DM_Mono'] text-[#9A8E80] mt-1">
              {products.length} of {category.productCount} products
            </p>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#991B1B] font-['Plus_Jakarta_Sans']">
            {error} —{" "}
            <button className="underline" onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        )}

        {/* ── Two-column layout on desktop ───── */}
        <div className="flex gap-6 items-start">
          {/* Desktop filter sidebar */}
          <FilterDrawer
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            pending={pendingFilters}
            onUpdate={updatePending}
            onApply={applyFilters}
            onClear={clearFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              isLoading={isLoading}
              isLoadingMore={isLoadingMore}
              hasMore={hasMore}
              searchQuery={searchQuery}
              onLoadMore={loadMore}
            />
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ─────────────── */}
      {/* (rendered outside to avoid clipping) */}
    </div>
  );
}