// ─────────────────────────────────────────────
//  CraftNest — /shop/[category]/page.tsx
//  Dynamic category route
// ─────────────────────────────────────────────

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductListingPage from '@/app/(shop)/components/ProductListingPage';
import type { CategoryMeta } from '@/app/(shop)/types';

// ── Static category registry (or fetch from Supabase) ─
const CATEGORY_REGISTRY: Record<string, CategoryMeta> = {
  all: {
    slug: "all",
    title: "All Products",
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

// ── generateStaticParams (for static export / ISR) ─
export function generateStaticParams() {
  return Object.keys(CATEGORY_REGISTRY).map((slug) => ({ category: slug }));
}

// ── generateMetadata ──────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> {
  const cat = CATEGORY_REGISTRY[params.category];
  if (!cat) return {};
  return {
    title: `${cat.title} — CraftNest`,
    description: cat.description,
  };
}

// ── Page ──────────────────────────────────────
export default function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = CATEGORY_REGISTRY[params.category];
  if (!category) notFound();

  return <ProductListingPage category={category} />;
}