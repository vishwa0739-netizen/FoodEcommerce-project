"use client";

// ─────────────────────────────────────────────
//  CraftNest — FilterDrawer
//  Mobile: bottom sheet (~85% height) with sticky Apply/Clear footer
//  Desktop: persistent left sidebar, always visible
// ─────────────────────────────────────────────

import { useCallback, useEffect, useState } from "react";
import type { DietaryTag, FilterState, SortOption } from "../types";
import { DEFAULT_FILTERS } from "../hooks";

// ── Constants ─────────────────────────────────
export const SORT_OPTIONS: SortOption[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

export const DIETARY_TAGS: DietaryTag[] = [
  "Vegan",
  "Gluten-Free",
  "Organic",
  "Sugar-Free",
  "Dairy-Free",
  "Keto",
  "Raw",
];

export const CATEGORIES = [
  { slug: "all", label: "All Products" },
  { slug: "oils", label: "Oils & Vinegars" },
  { slug: "honey", label: "Honey & Preserves" },
  { slug: "chocolate", label: "Chocolate" },
  { slug: "spices", label: "Spices & Blends" },
  { slug: "coffee", label: "Coffee" },
  { slug: "tea", label: "Loose Leaf Tea" },
  { slug: "sweets", label: "Artisan Sweets" },
  { slug: "snacks", label: "Gourmet Snacks" },
];

const PRICE_MAX = 10000;

// ── Price Range Slider ────────────────────────
function PriceSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: (range: { min: number; max: number }) => void;
}) {
  const percent = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-['DM_Mono'] text-[#3D2B1F]">
        <span>₹{value.min.toLocaleString("en-IN")}</span>
        <span>₹{value.max.toLocaleString("en-IN")}</span>
      </div>

      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-1 bg-[#E8E4DC] rounded-full" />
        {/* Active range */}
        <div
          className="absolute h-1 bg-[#bf8952] rounded-full"
          style={{
            left: `${percent(value.min)}%`,
            width: `${percent(value.max) - percent(value.min)}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={value.min}
          onChange={(e) =>
            onChange({ ...value, min: Math.min(+e.target.value, value.max - 100) })
          }
          className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer range-thumb"
          style={{ zIndex: value.min > max - 100 ? 5 : 3 }}
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={100}
          value={value.max}
          onChange={(e) =>
            onChange({ ...value, max: Math.max(+e.target.value, value.min + 100) })
          }
          className="absolute w-full h-1 appearance-none bg-transparent cursor-pointer range-thumb"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
}

// ── FilterContent (shared between mobile/desktop) ─
interface FilterContentProps {
  pending: FilterState;
  onUpdate: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

function FilterContent({ pending, onUpdate }: FilterContentProps) {
  const toggleTag = (tag: DietaryTag) => {
    const next = pending.tags.includes(tag)
      ? pending.tags.filter((t) => t !== tag)
      : [...pending.tags, tag];
    onUpdate("tags", next);
  };

  return (
    <div className="space-y-6">
      {/* Sort */}
      <section>
        <h3 className="text-[11px] uppercase tracking-[0.12em] font-['DM_Mono'] text-[#9A8E80] mb-3">
          Sort by
        </h3>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onUpdate("sort", opt.value)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-['Plus_Jakarta_Sans'] transition-colors ${
                pending.sort === opt.value
                  ? "bg-[#691626]/8 text-[#691626] font-medium"
                  : "text-[#3D2B1F] hover:bg-[#F3EFE9]"
              }`}
            >
              {opt.label}
              {pending.sort === opt.value && (
                <svg className="w-3.5 h-3.5 text-[#691626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="h-px bg-[#E8E4DC]" />

      {/* Price Range */}
      <section>
        <h3 className="text-[11px] uppercase tracking-[0.12em] font-['DM_Mono'] text-[#9A8E80] mb-3">
          Price range
        </h3>
        <PriceSlider
          min={0}
          max={PRICE_MAX}
          value={pending.priceRange}
          onChange={(range) => onUpdate("priceRange", range)}
        />
      </section>

      <div className="h-px bg-[#E8E4DC]" />

      {/* Category */}
      <section>
        <h3 className="text-[11px] uppercase tracking-[0.12em] font-['DM_Mono'] text-[#9A8E80] mb-3">
          Category
        </h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onUpdate("category", cat.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-['Plus_Jakarta_Sans'] transition-colors ${
                pending.category === cat.slug
                  ? "bg-[#691626]/8 text-[#691626] font-medium"
                  : "text-[#3D2B1F] hover:bg-[#F3EFE9]"
              }`}
            >
              {cat.label}
              {pending.category === cat.slug && (
                <svg className="w-3.5 h-3.5 text-[#691626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="h-px bg-[#E8E4DC]" />

      {/* Dietary Tags */}
      <section>
        <h3 className="text-[11px] uppercase tracking-[0.12em] font-['DM_Mono'] text-[#9A8E80] mb-3">
          Dietary
        </h3>
        <div className="flex flex-wrap gap-2">
          {DIETARY_TAGS.map((tag) => {
            const active = pending.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-['Plus_Jakarta_Sans'] font-medium border transition-all duration-150 ${
                  active
                    ? "bg-[#691626] text-[#FCFCF7] border-[#691626]"
                    : "bg-transparent text-[#3D2B1F] border-[#D9D3C7] hover:border-[#bf8952]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      <div className="h-px bg-[#E8E4DC]" />

      {/* In Stock toggle */}
      <section>
        <button
          onClick={() => onUpdate("inStockOnly", !pending.inStockOnly)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-sm font-['Plus_Jakarta_Sans'] text-[#1A1108]">
            In stock only
          </span>
          <div
          className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 ${
            pending.inStockOnly ? "bg-[#691626]" : "bg-[#D9D3C7]"
            }`}
            >
            <div
              className={`absolute top-[2px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
                pending.inStockOnly ? "translate-x-[22px]" : "translate-x-[2px]"
              }`}
            />
            </div>
        </button>
      </section>
    </div>
  );
}

// ── Main FilterDrawer ─────────────────────────
interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pending: FilterState;
  onUpdate: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onApply: () => void;
  onClear: () => void;
  activeFilterCount: number;
}

export function FilterDrawer({
  isOpen,
  onClose,
  pending,
  onUpdate,
  onApply,
  onClear,
  activeFilterCount,
}: FilterDrawerProps) {
  // Lock body scroll on mobile when drawer open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleApply = useCallback(() => {
    onApply();
    onClose();
  }, [onApply, onClose]);

  return (
    <>
      {/* ── Desktop: persistent sidebar ──────── */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 self-start sticky top-24">
        <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E8E4DC] flex items-center justify-between">
            <span className="text-sm font-['Fraunces'] font-semibold text-[#1A1108]">
              Filters
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-[#bf8952] font-['Plus_Jakarta_Sans'] hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="p-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
            <FilterContent pending={pending} onUpdate={onUpdate} />
          </div>
          {/* Desktop apply button */}
          <div className="p-4 border-t border-[#E8E4DC]">
            <button
              onClick={onApply}
              className="w-full h-10 bg-[#691626] text-[#FCFCF7] rounded-xl text-sm font-['Plus_Jakarta_Sans'] font-semibold hover:bg-[#7d1b2e] transition-colors"
            >
              Apply{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile: bottom sheet ─────────────── */}
      <div className="lg:hidden">
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-[100] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Sheet */}
        <div
          className={`
            fixed bottom-0 inset-x-0 z-[110]
            bg-[#FCFCF7] rounded-t-[24px]
            flex flex-col
            transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)]
            ${isOpen ? "translate-y-0" : "translate-y-full"}
          `}
          style={{ height: "85svh" }}
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          {/* Handle + header */}
          <div className="flex flex-col items-center pt-3 pb-0 px-5">
            <div className="w-10 h-1 rounded-full bg-[#D9D3C7] mb-4" />
            <div className="w-full flex items-center justify-between pb-3 border-b border-[#E8E4DC]">
              <span className="text-base font-['Fraunces'] font-semibold text-[#1A1108]">
                Filters
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[#F3EFE9] text-[#3D2B1F]"
                aria-label="Close filters"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Scrollable filter content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <FilterContent pending={pending} onUpdate={onUpdate} />
          </div>

          {/* Sticky footer */}
          <div className="px-5 pb-[env(safe-area-inset-bottom,16px)] pt-3 border-t border-[#E8E4DC] flex gap-3 bg-[#FCFCF7]">
            <button
              onClick={onClear}
              className="h-11 flex-1 border border-[#D9D3C7] text-[#3D2B1F] rounded-xl text-sm font-['Plus_Jakarta_Sans'] font-medium hover:border-[#bf8952] transition-colors"
            >
              Clear all
            </button>
            <button
              onClick={handleApply}
              className="h-11 flex-[2] bg-[#691626] text-[#FCFCF7] rounded-xl text-sm font-['Plus_Jakarta_Sans'] font-semibold hover:bg-[#7d1b2e] active:scale-[0.98] transition-all"
            >
              Apply filters{activeFilterCount > 0 ? ` · ${activeFilterCount}` : ""}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}