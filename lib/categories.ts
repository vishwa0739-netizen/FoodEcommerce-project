// ─────────────────────────────────────────────
//  Suresh Foods — Category Registry
//  Single source of truth for category metadata.
//  Previously this lived inline inside the shop
//  page and was imported into category/[slug]/page.tsx
//  via a page-to-page import. Next.js treats page.tsx
//  as a special route module — pulling extra named
//  exports out of it is fragile and can cause
//  inconsistent dev-server compiles. Living in a
//  plain lib file fixes that for good.
// ─────────────────────────────────────────────

import type { CategoryMeta } from "@/app/(shop)/types";

export const CATEGORY_REGISTRY: Record<string, CategoryMeta> = {
  all: {
    slug: "all",
    title: "Shop All",
    description: "Browse our full range of artisan & gourmet goods.",
    productCount: 120,
  },
  oils: {
    slug: "oils",
    title: "Oils & Vinegars",
    description: "Cold-pressed, aged, and single-origin.",
    productCount: 18,
  },
  honey: {
    slug: "honey",
    title: "Honey & Preserves",
    description: "Raw, single-origin honey and small-batch preserves.",
    productCount: 15,
  },
  chocolate: {
    slug: "chocolate",
    title: "Chocolate",
    description: "Bean-to-bar and small-batch craft chocolate.",
    productCount: 21,
  },
  spices: {
    slug: "spices",
    title: "Spices & Blends",
    description: "Hand-sourced, stone-ground, and small-batch blended.",
    productCount: 34,
  },
  coffee: {
    slug: "coffee",
    title: "Coffee",
    description: "Single-origin, ethically sourced coffee.",
    productCount: 14,
  },
  tea: {
    slug: "tea",
    title: "Loose Leaf Tea",
    description: "Whole-leaf teas and botanical blends.",
    productCount: 8,
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
};