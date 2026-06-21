// ─────────────────────────────────────────────
//  Suresh Foods — /shop/page.tsx
//  Single static product listing page.
//  Category filtering happens via ?category=slug
//  Search happens via ?q=term (set by the global
//  Navbar search — there is NO second search bar
//  on this page anymore).
// ─────────────────────────────────────────────

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductListingPage from "@/app/(site)/(shop)/components/ProductListingPage";
import { CATEGORY_REGISTRY } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Shop All — Suresh Foods",
  description:
    "Browse our full range of artisan & gourmet goods — oils, honey, chocolate, spices, coffee, and tea.",
};

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category: categorySlug, q } = await searchParams;
  const slug = categorySlug?.trim() || "all";

  const category = CATEGORY_REGISTRY[slug];

  // Genuinely unknown category slug → real 404,
  // NOT a dead link. This is the only place a
  // category should ever 404 from now on.
  if (!category) {
    notFound();
  }

  return <ProductListingPage category={category} initialQuery={q ?? ""} />;
}