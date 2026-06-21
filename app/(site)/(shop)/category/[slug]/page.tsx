// ─────────────────────────────────────────────
//  Suresh Foods — /category/[slug]/page.tsx
//  This route exists ONLY so old/external links
//  like /category/chocolate don't dead-end.
//  It immediately forwards to the real filtering
//  page at /shop?category=slug. All actual
//  rendering logic lives in ProductListingPage.
// ─────────────────────────────────────────────

import { redirect, notFound } from "next/navigation";
import { CATEGORY_REGISTRY } from "@/lib/categories";

interface CategoryRedirectProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryRedirectPage({
  params,
}: CategoryRedirectProps) {
  const { slug } = await params;

  // Only forward known categories. Unknown slugs
  // hit the real not-found.tsx, same as /shop.
  if (!CATEGORY_REGISTRY[slug]) {
    notFound();
  }

  redirect(`/shop?category=${slug}`);
}