// ─────────────────────────────────────────────
//  CraftNest — /api/products/route.ts
//  Supabase-backed product listing API
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { ProductsResponse } from '@/app/(shop)/types';
// Initialise Supabase (server-side — no RLS bypass unless you want admin)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const limit = parseInt(searchParams.get("limit") ?? "12", 10);
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "featured";
  const minPrice = parseInt(searchParams.get("minPrice") ?? "0", 10);
  const maxPrice = parseInt(searchParams.get("maxPrice") ?? "999999", 10);
  const tags = searchParams.get("tags")?.split(",").filter(Boolean) ?? [];
  const inStockOnly = searchParams.get("inStock") === "true";
  const q = searchParams.get("q") ?? "";

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // ── Build query ─────────────────────────────
  let query = supabase
    .from("products")
    .select("*", { count: "exact" })
    .gte("price", minPrice)
    .lte("price", maxPrice)
    .range(from, to);

  // Category filter
  if (category !== "all") {
    query = query.eq("category", category);
  }

  // In stock
  if (inStockOnly) {
    query = query.eq("in_stock", true);
  }

  // Dietary tags (array overlap)
  if (tags.length > 0) {
    query = query.overlaps("tags", tags);
  }

  // Full-text search
  if (q) {
    query = query.textSearch("fts", q, { type: "websearch" });
  }

  // Sort
  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "rating":
      query = query.order("rating", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("is_featured", { ascending: false });
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = count ?? 0;
  const hasMore = from + limit < total;

  // ── Map DB columns → Product interface ──────
  // Adjust column names to match your actual Supabase schema
  const products = (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    price: row.price,
    originalPrice: row.original_price ?? undefined,
    currency: "INR",
    rating: row.rating ?? 0,
    reviewCount: row.review_count ?? 0,
    images: row.images ?? [],
    badge: row.badge ?? undefined,
    badgePercent: row.badge_percent ?? undefined,
    tags: row.tags ?? [],
    category: row.category,
    isWishlisted: false, // set from user session if needed
    inStock: row.in_stock ?? true,
    description: row.description ?? undefined,
  }));

  const response: ProductsResponse = {
    data: products,
    total,
    page,
    hasMore,
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}