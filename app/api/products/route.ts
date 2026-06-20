// ─────────────────────────────────────────────
//  Suresh Foods — /api/products/route.ts
//  Supabase-backed product listing API, with a
//  fallback catalogue so the storefront never
//  shows a broken/empty grid while Supabase is
//  still being wired up.
// ─────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { ProductsResponse } from "@/app/(shop)/types";
import { queryFallbackProducts } from "@/lib/fallback-products";

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

  const fallbackQuery = {
    page,
    limit,
    category,
    sort,
    minPrice,
    maxPrice,
    tags,
    inStockOnly,
    q,
  };

  // ── Guard env vars BEFORE creating the client ──
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "[/api/products] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY — serving fallback catalogue."
    );
    return NextResponse.json(queryFallbackProducts(fallbackQuery));
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .gte("price", minPrice)
      .lte("price", maxPrice)
      .range(from, to);

    if (category !== "all") {
      query = query.eq("category", category);
    }

    if (inStockOnly) {
      query = query.eq("in_stock", true);
    }

    if (tags.length > 0) {
      query = query.overlaps("tags", tags);
    }

    if (q) {
      query = query.textSearch("fts", q, { type: "websearch" });
    }

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
      // Common while you're still building: the "products" table
      // (or a referenced column) doesn't exist yet. Serve the
      // fallback catalogue instead of breaking the UI — the real
      // Supabase message still goes to your terminal.
      console.error(
        "[/api/products] Supabase error, serving fallback:",
        error.message
      );
      return NextResponse.json(queryFallbackProducts(fallbackQuery));
    }

    const total = count ?? 0;
    const hasMore = from + limit < total;

    // ── Map DB columns → Product interface ──────
    // Adjust column names to match your actual schema.
    const products = (data ?? []).map((row: Record<string, unknown>) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      brand: row.brand,
      price: row.price,
      originalPrice: row.original_price ?? undefined,
      currency: "INR",
      rating: row.rating ?? 0,
      reviewCount: row.review_count ?? 0,
      images: Array.isArray(row.images) ? row.images : [],
      badge: row.badge ?? undefined,
      badgePercent: row.badge_percent ?? undefined,
      tags: Array.isArray(row.tags) ? row.tags : [],
      category: row.category,
      isWishlisted: false, // set from user session if needed
      inStock: row.in_stock ?? true,
      description: row.description ?? undefined,
    }));

    // Table exists but hasn't been seeded yet (0 rows, first page,
    // no filters applied) — serve the fallback catalogue rather
    // than a permanently empty Shop All page.
    if (total === 0 && page === 1 && category === "all" && !q) {
      console.warn(
        "[/api/products] `products` table is empty — serving fallback catalogue."
      );
      return NextResponse.json(queryFallbackProducts(fallbackQuery));
    }

    const response: ProductsResponse = {
      data: products as ProductsResponse["data"],
      total,
      page,
      hasMore,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    // Catches anything unexpected (network blip, malformed
    // query, etc.) so the route always returns JSON the
    // client's error banner can render — never a raw crash.
    console.error("[/api/products] Unexpected error, serving fallback:", err);
    return NextResponse.json(queryFallbackProducts(fallbackQuery));
  }
}