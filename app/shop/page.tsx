// ─────────────────────────────────────────────
//  CraftNest — /shop/page.tsx
//  Single static product listing page.
//  Category switching happens client-side via
//  the FilterDrawer/category chips — no dynamic
//  routing, no separate URLs per category.
// ─────────────────────────────────────────────

import type { Metadata } from "next";
import ProductListingPage from "@/app/(shop)/components/ProductListingPage";
import type { CategoryMeta } from "@/app/(shop)/types";

export const metadata: Metadata = {
  title: "Shop All — Maitri & Co.",
  description:
    "Browse our full range of artisan & gourmet goods — oils, honey, chocolate, spices, coffee, and tea.",
};

// ── Category metadata registry ────────────────
// Kept here (not as separate routes) so the same
// data can drive category titles/descriptions if
// you later want the page heading to update when
// a category chip is clicked client-side.
export const CATEGORY_REGISTRY: Record<string, CategoryMeta> = {
  all: {
    slug: "all",
    title: "Shop All",
    description: "Browse our full range of artisan & gourmet goods.",
    productCount: 120,
  },
  spices: {
    slug: "spices",
    title: "Spices & Blends",
    description: "Hand-sourced, stone-ground, and small-batch blended.",
    productCount: 34,
  },
  oils: {
    slug: "oils",
    title: "Oils & Vinegars",
    description: "Cold-pressed, aged, and single-origin.",
    productCount: 18,
  },
  sweets: {
    slug: "sweets",
    title: "Artisan Sweets",
    description: "Small-batch confections made with natural ingredients.",
    productCount: 27,
  },
  snacks: {
    slug: "snacks",
    title: "Gourmet Snacks",
    description: "Thoughtfully made snacks worth savouring.",
    productCount: 41,
  },
  beverages: {
    slug: "beverages",
    title: "Beverages",
    description: "Teas, coffees, and more from passionate producers.",
    productCount: 22,
  },
  preserves: {
    slug: "preserves",
    title: "Preserves & Jams",
    description: "Made in season, preserved with care.",
    productCount: 15,
  },
};

export default function ShopPage() {
  // Defaulting to "all" — ProductListingPage owns category
  // switching internally via its filter state.
  const category = CATEGORY_REGISTRY.all;

  return <ProductListingPage category={category} />;
}