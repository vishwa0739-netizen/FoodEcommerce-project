// ─────────────────────────────────────────────
//  Suresh Foods — Fallback Catalogue
//  Used by /api/products whenever Supabase isn't
//  configured yet, the `products` table doesn't
//  exist, or a query errors out — so the storefront
//  always has something real to render instead of
//  the "Failed to fetch products" / empty-grid combo.
// ─────────────────────────────────────────────

import type { Product, ProductsResponse } from "@/app/(site)/(shop)/types";

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "fb-olive-oil",
    slug: "cold-pressed-olive-oil",
    name: "Cold-Pressed Olive Oil",
    brand: "Suresh Foods",
    price: 1990,
    currency: "INR",
    rating: 4.8,
    reviewCount: 128,
    images: ["/images/prod-olive-oil.png"],
    badge: "Bestseller",
    tags: ["Vegan", "Gluten-Free"],
    category: "oils",
    isWishlisted: false,
    inStock: true,
    description: "Single-estate, cold-pressed extra virgin olive oil.",
  },
  {
    id: "fb-balsamic",
    slug: "aged-balsamic-vinegar",
    name: "Aged Balsamic Vinegar",
    brand: "Suresh Foods",
    price: 2290,
    currency: "INR",
    rating: 4.9,
    reviewCount: 61,
    images: ["/images/prod-balsamic.png"],
    badge: "New",
    tags: ["Vegan", "Gluten-Free"],
    category: "oils",
    isWishlisted: false,
    inStock: true,
    description: "Twelve-year barrel-aged balsamic vinegar of Modena.",
  },
  {
    id: "fb-honey",
    slug: "wildflower-honey",
    name: "Wildflower Honey",
    brand: "Suresh Foods",
    price: 1290,
    currency: "INR",
    rating: 4.7,
    reviewCount: 94,
    images: ["/images/prod-honey.png"],
    tags: ["Gluten-Free", "Raw"],
    category: "honey",
    isWishlisted: false,
    inStock: true,
    description: "Raw, single-origin wildflower honey, cold-extracted.",
  },
  {
    id: "fb-fig-preserve",
    slug: "fig-walnut-preserve",
    name: "Fig & Walnut Preserve",
    brand: "Suresh Foods",
    price: 990,
    currency: "INR",
    rating: 4.5,
    reviewCount: 88,
    images: ["/images/prod-preserve.png"],
    tags: ["Vegan"],
    category: "honey",
    isWishlisted: false,
    inStock: true,
    description: "Small-batch fig preserve with toasted walnut.",
  },
  {
    id: "fb-dark-chocolate",
    slug: "72-dark-chocolate",
    name: "72% Dark Chocolate",
    brand: "Suresh Foods",
    price: 690,
    originalPrice: 850,
    currency: "INR",
    rating: 4.6,
    reviewCount: 212,
    images: ["/images/prod-chocolate.png"],
    badge: "Limited",
    badgePercent: 19,
    tags: ["Vegan", "Dairy-Free"],
    category: "chocolate",
    isWishlisted: false,
    inStock: true,
    description: "Single-origin 72% bean-to-bar dark chocolate.",
  },
  {
    id: "fb-saffron",
    slug: "pure-saffron-threads",
    name: "Pure Saffron Threads",
    brand: "Suresh Foods",
    price: 1290,
    currency: "INR",
    rating: 4.9,
    reviewCount: 47,
    images: ["/images/prod-saffron.png"],
    tags: ["Gluten-Free", "Vegan"],
    category: "spices",
    isWishlisted: false,
    inStock: true,
    description: "Hand-picked, sun-dried Kashmiri saffron threads.",
  },
  {
    id: "fb-coffee",
    slug: "single-origin-coffee",
    name: "Single-Origin Coffee",
    brand: "Suresh Foods",
    price: 1490,
    currency: "INR",
    rating: 4.6,
    reviewCount: 156,
    images: ["/images/prod-coffee.png"],
    tags: ["Vegan"],
    category: "coffee",
    isWishlisted: false,
    inStock: true,
    description: "Ethically sourced, medium-roast single-origin coffee.",
  },
  {
    id: "fb-earl-grey",
    slug: "earl-grey-loose-tea",
    name: "Earl Grey Loose Tea",
    brand: "Suresh Foods",
    price: 890,
    currency: "INR",
    rating: 4.7,
    reviewCount: 73,
    images: ["/images/prod-tea.png"],
    tags: ["Vegan", "Gluten-Free"],
    category: "tea",
    isWishlisted: false,
    inStock: true,
    description: "Whole-leaf Earl Grey with natural bergamot oil.",
  },
];

interface FallbackQuery {
  page: number;
  limit: number;
  category: string;
  sort: string;
  minPrice: number;
  maxPrice: number;
  tags: string[];
  inStockOnly: boolean;
  q: string;
}

export function queryFallbackProducts({
  page,
  limit,
  category,
  sort,
  minPrice,
  maxPrice,
  tags,
  inStockOnly,
  q,
}: FallbackQuery): ProductsResponse {
  let items = [...FALLBACK_PRODUCTS];

  if (category !== "all") {
    items = items.filter((p) => p.category === category);
  }
  items = items.filter((p) => p.price >= minPrice && p.price <= maxPrice);
  if (inStockOnly) {
    items = items.filter((p) => p.inStock);
  }
  if (tags.length > 0) {
    items = items.filter((p) =>
      tags.some((t) => p.tags.includes(t as Product["tags"][number]))
    );
  }
  if (q) {
    const needle = q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.description?.toLowerCase().includes(needle)
    );
  }

  switch (sort) {
    case "price_asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      items.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  const total = items.length;
  const from = (page - 1) * limit;
  const to = from + limit;
  const data = items.slice(from, to);
  const hasMore = to < total;

  return { data, total, page, hasMore };
}