"use client";

// ─────────────────────────────────────────────
//  CraftNest — Custom Hooks
// ─────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from "react";
import type { FilterState, Product, ProductsResponse, SortKey } from "../types";

// ── 1. useDebounce ────────────────────────────
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ── 2. useRecentSearches ──────────────────────
const STORAGE_KEY = "cn_recent_searches";
const MAX_RECENT = 6;

export function useRecentSearches() {
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setRecents(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const add = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecents((prev) => {
      const updated = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(
        0,
        MAX_RECENT
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clear = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecents([]);
  }, []);

  return { recents, add, clear };
}

// ── 3. useFilterState ─────────────────────────
const DEFAULT_PRICE_RANGE = { min: 0, max: 50000 };

export const DEFAULT_FILTERS: FilterState = {
  priceRange: DEFAULT_PRICE_RANGE,
  tags: [],
  category: "all",
  sort: "featured" as SortKey,
  inStockOnly: false,
};

export function useFilterState() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [pendingFilters, setPendingFilters] =
    useState<FilterState>(DEFAULT_FILTERS);

  const updatePending = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setPendingFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const applyFilters = useCallback(() => {
    setFilters(pendingFilters);
  }, [pendingFilters]);

  const clearFilters = useCallback(() => {
    setPendingFilters(DEFAULT_FILTERS);
    setFilters(DEFAULT_FILTERS);
  }, []);

  const activeFilterCount = Object.entries(filters).reduce((acc, [k, v]) => {
    if (k === "sort" && v === "featured") return acc;
    if (k === "category" && v === "all") return acc;
    if (k === "tags" && Array.isArray(v) && v.length === 0) return acc;
    if (k === "inStockOnly" && !v) return acc;
    if (
      k === "priceRange" &&
      (v as { min: number; max: number }).min === DEFAULT_PRICE_RANGE.min &&
      (v as { min: number; max: number }).max === DEFAULT_PRICE_RANGE.max
    )
      return acc;
    return acc + 1;
  }, 0);

  return {
    filters,
    pendingFilters,
    updatePending,
    applyFilters,
    clearFilters,
    activeFilterCount,
  };
}

// ── 4. useProducts (infinite scroll + filters) ─
const PAGE_SIZE = 12;

export function useProducts(
  filters: FilterState,
  searchQuery: string,
  categorySlug: string
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset on filter/search change
  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery, categorySlug]);

  const fetchPage = useCallback(
    async (pageNum: number, reset = false) => {
      try {
        if (reset) setIsLoading(true);
        else setIsLoadingMore(true);

        // Build Supabase query params — swap this with your actual Supabase client
        const params = new URLSearchParams({
          page: String(pageNum),
          limit: String(PAGE_SIZE),
          category: categorySlug,
          sort: filters.sort,
          minPrice: String(filters.priceRange.min),
          maxPrice: String(filters.priceRange.max),
          tags: filters.tags.join(","),
          inStock: String(filters.inStockOnly),
          q: searchQuery,
        });

        const res = await fetch(`/api/products?${params}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const json: ProductsResponse = await res.json();

        setProducts((prev) => (reset ? json.data : [...prev, ...json.data]));
        setHasMore(json.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [filters, searchQuery, categorySlug]
  );

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPage(nextPage);
  }, [page, isLoadingMore, hasMore, fetchPage]);

  return { products, isLoading, isLoadingMore, hasMore, error, loadMore };
}

// ── 5. useIntersectionObserver (infinite scroll trigger) ─
export function useIntersectionObserver(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
}