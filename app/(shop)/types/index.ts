// ─────────────────────────────────────────────
//  CraftNest — Product Listing Types
// ─────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  images: string[];
  badge?: "New" | "Sale" | "Bestseller" | "Limited" | string;
  badgePercent?: number; // e.g. 20 for "20% off"
  tags: DietaryTag[];
  category: string;
  isWishlisted?: boolean;
  inStock: boolean;
  description?: string;
}

export type DietaryTag =
  | "Vegan"
  | "Gluten-Free"
  | "Organic"
  | "Sugar-Free"
  | "Dairy-Free"
  | "Keto"
  | "Raw";

export type SortKey =
  | "featured"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "newest";

export interface SortOption {
  label: string;
  value: SortKey;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface FilterState {
  priceRange: PriceRange;
  tags: DietaryTag[];
  category: string;
  sort: SortKey;
  inStockOnly: boolean;
}

export interface CategoryMeta {
  slug: string;
  title: string;
  description?: string;
  productCount?: number;
}

// API / Supabase response shape
export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  hasMore: boolean;
}