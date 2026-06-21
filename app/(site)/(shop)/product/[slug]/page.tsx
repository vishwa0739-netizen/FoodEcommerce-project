"use client";

// ─────────────────────────────────────────────
//  CraftNest — Product Detail Page
//  app/product/[slug]/page.tsx
//
//  Rewritten from a standalone component that
//  injected a raw global <style> tag (universal
//  `*` reset, `body`, `button`, `img` overrides,
//  and a `:root` redefinition). That tag was NOT
//  scoped — it leaked into every other component
//  mounted on the page (Navbar, Footer), which is
//  why they visually "collapsed". This version
//  uses only Tailwind + the app's existing design
//  tokens (brand/accent/etc. from globals.css),
//  so nothing here can affect anything outside it.
// ─────────────────────────────────────────────

import { useState, useRef, useCallback, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────
interface NutritionRow { label: string; value: string; }
interface ProductDetail {
  id: string; name: string; shortDesc: string; price: number;
  originalPrice: number | null; rating: number; reviewCount: number;
  badge: string; images: string[]; nutrition: NutritionRow[];
  ingredients: string; tags: string[];
}
interface Review { id: number; name: string; rating: number; date: string; text: string; avatar: string; }
interface RelatedProduct { id: string; name: string; price: number; originalPrice: number | null; image: string; }

// ─── Dummy data — replace with a real fetch-by-slug ─
// TODO: swap for Supabase lookup using params.slug.
const PRODUCT: ProductDetail = {
  id: "saffron-walnut-preserve",
  name: "Saffron & Walnut Artisan Preserve",
  shortDesc:
    "Sun-dried Kashmiri walnuts slow-cooked with hand-picked saffron threads and raw forest honey. No preservatives, no shortcuts — just 72 hours of craft.",
  price: 1090,
  originalPrice: 1650,
  rating: 4.8,
  reviewCount: 214,
  badge: "Bestseller",
  images: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=800&q=80",
  ],
  nutrition: [
    { label: "Serving size", value: "30 g" },
    { label: "Calories", value: "142 kcal" },
    { label: "Total fat", value: "8.4 g" },
    { label: "Carbohydrates", value: "14.2 g" },
    { label: "Protein", value: "3.1 g" },
    { label: "Sugar", value: "10.8 g" },
  ],
  ingredients:
    "Walnuts (46%), raw forest honey (32%), saffron threads (8%), cane sugar (7%), lemon juice, cardamom, sea salt. Free from artificial preservatives, colours, and flavours.",
  tags: ["Vegan", "Gluten-free", "Cold-chain shipped"],
};

const REVIEWS: Review[] = [
  { id: 1, name: "Priya M.", rating: 5, date: "12 Jun 2025", avatar: "PM",
    text: "Opened the jar and the saffron hit immediately. Spreads beautifully on sourdough and the walnuts stay chunky. Worth every rupee." },
  { id: 2, name: "Rahul S.", rating: 5, date: "3 Jun 2025", avatar: "RS",
    text: "Gifted three jars to family last Diwali. All three called me the same evening. Now a standing order." },
  { id: 3, name: "Ananya K.", rating: 4, date: "28 May 2025", avatar: "AK",
    text: "Exceptional flavour — the honey and saffron balance is perfect. Slightly sweeter than expected but that's personal preference. Four stars only because the lid was a tiny bit sticky on arrival." },
];

const RELATED: RelatedProduct[] = [
  { id: "r1", name: "Rose Petal & Pistachio Jam", price: 980, originalPrice: 1200,
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80" },
  { id: "r2", name: "Dark Fig & Cardamom Spread", price: 850, originalPrice: null,
    image: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80" },
  { id: "r3", name: "Hazelnut Praline Butter", price: 1150, originalPrice: 1400,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80" },
  { id: "r4", name: "Alphonso Mango Conserve", price: 720, originalPrice: null,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
];

// ─── Helpers ────────────────────────────────────
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? "#bf8952" : "none"}
          stroke="#bf8952" strokeWidth="1.8" aria-hidden="true">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </span>
  );
}

function fmt(n: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function pct(orig: number, disc: number): number {
  return Math.round(((orig - disc) / orig) * 100);
}

// ─── Mobile gallery ──────────────────────────────
function MobileGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);

  const go = useCallback(
    (dir: number) => setActive((p) => Math.max(0, Math.min(images.length - 1, p + dir))),
    [images.length]
  );

  return (
    <div className="relative w-full aspect-square overflow-hidden md:hidden" aria-label="Product images">
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (startX.current === null) return;
          const dx = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        }}
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {images.map((src, i) => (
          <img key={i} src={src} alt={`Product view ${i + 1}`}
            className="h-full w-full flex-none object-cover" loading={i === 0 ? "eager" : "lazy"} />
        ))}
      </div>
      <div className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
        {images.map((_, i) => (
          <button key={i}
            onClick={() => setActive(i)}
            className={cn(
              "h-1.5 rounded-full bg-white/55 transition-all",
              i === active ? "w-5 bg-white" : "w-1.5",
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Desktop gallery ─────────────────────────────
function DesktopGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const r = imgRef.current.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div className="hidden gap-3 items-start sticky top-24 md:flex">
      <div className="flex w-20 shrink-0 flex-col gap-2">
        {images.map((src, i) => (
          <button key={i}
            onClick={() => setActive(i)} aria-label={`View image ${i + 1}`}
            className={cn(
              "h-20 w-20 overflow-hidden rounded-md border-2 transition-colors",
              i === active ? "border-accent" : "border-transparent hover:border-accent/50",
            )}
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div
        className="relative flex-1 overflow-hidden rounded-2xl cursor-zoom-in"
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
        aria-label="Hover to zoom"
      >
        <img
          ref={imgRef}
          src={images[active]}
          alt="Product main view"
          className={cn("aspect-square w-full object-cover transition-opacity", zoom && "opacity-0")}
        />
        {zoom && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${images[active]})`,
              backgroundSize: "200%",
              backgroundRepeat: "no-repeat",
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Accordion ───────────────────────────────────
function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-border last:border-b">
      <button
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-foreground"
      >
        <span>{title}</span>
        <svg
          className={cn("h-[18px] w-[18px] text-muted-foreground transition-transform", open && "rotate-180")}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="pb-4 text-[13px] leading-relaxed text-muted-foreground">{children}</div>}
    </div>
  );
}

// ─── Quantity stepper ────────────────────────────
function QuantityStepper({ qty, setQty }: { qty: number; setQty: React.Dispatch<React.SetStateAction<number>> }) {
  return (
    <div className="inline-flex h-11 items-center overflow-hidden rounded-lg border border-border" role="group" aria-label="Quantity">
      <button
        className="flex h-full w-11 shrink-0 items-center justify-center text-lg text-foreground transition-colors hover:bg-accent/10 disabled:opacity-35"
        onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" disabled={qty <= 1}
      >−</button>
      <span className="flex h-full w-12 items-center justify-center border-x border-border font-mono-price text-base font-medium" aria-live="polite">
        {qty}
      </span>
      <button
        className="flex h-full w-11 shrink-0 items-center justify-center text-lg text-foreground transition-colors hover:bg-accent/10 disabled:opacity-35"
        onClick={() => setQty((q) => Math.min(12, q + 1))} aria-label="Increase quantity" disabled={qty >= 12}
      >+</button>
    </div>
  );
}

// ─── Wishlist button ─────────────────────────────
function WishlistButton({ size = "md" }: { size?: "sm" | "md" }) {
  const [wished, setWished] = useState(false);
  const iconSize = size === "sm" ? 18 : 22;
  return (
    <button
      onClick={() => setWished((p) => !p)}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-all",
        wished ? "border-brand scale-105" : "border-border text-muted-foreground hover:border-brand hover:text-brand",
      )}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24"
        fill={wished ? "#691626" : "none"} stroke={wished ? "#691626" : "currentColor"}
        strokeWidth="1.8" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

// ─── Add to Cart ─────────────────────────────────
type ATCState = "idle" | "loading" | "added";

function AddToCartBtn({ variant = "inline" }: { variant?: "inline" | "sticky" }) {
  const [state, setState] = useState<ATCState>("idle");
  const handleClick = () => {
    setState("loading");
    setTimeout(() => { setState("added"); setTimeout(() => setState("idle"), 2200); }, 600);
  };
  return (
    <button
      onClick={handleClick} disabled={state !== "idle"} aria-live="polite"
      className={cn(
        "h-14 rounded-lg text-[15px] font-semibold tracking-wide transition-colors active:scale-[.98]",
        variant === "inline" ? "hidden w-full md:flex md:items-center md:justify-center" : "flex w-full items-center justify-center",
        state === "idle" && "bg-brand text-primary-foreground hover:bg-brand-700",
        state === "loading" && "bg-brand text-primary-foreground/70",
        state === "added" && "bg-emerald-600 text-white",
      )}
    >
      {state === "idle" && `Add to cart — ${fmt(PRODUCT.price)}`}
      {state === "loading" && "Adding…"}
      {state === "added" && "✓ Added to cart"}
    </button>
  );
}

// ─── Review card ─────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-2.5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono-price text-xs font-medium text-accent-700">
          {review.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </div>
        <div className="ml-auto"><StarRating rating={review.rating} size={14} /></div>
      </div>
      <p className="text-[13px] leading-relaxed text-muted-foreground">{review.text}</p>
    </div>
  );
}

// ─── Related card ────────────────────────────────
function RelatedCard({ product }: { product: RelatedProduct }) {
  return (
    <div className="flex-none w-40 sm:w-48 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-square overflow-hidden">
        <img src={product.image} alt={product.name} loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
      </div>
      <div className="p-2.5">
        <p className="mb-1.5 line-clamp-2 text-xs font-semibold leading-snug text-foreground">{product.name}</p>
        <div className="flex items-center gap-1.5">
          <span className="font-mono-price text-sm text-brand">{fmt(product.price)}</span>
          {product.originalPrice && (
            <span className="font-mono-price text-[11px] text-muted-foreground line-through">{fmt(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────
export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);

  return (
    <div className="max-w-[1440px] mx-auto pb-24 md:pb-0">
      <nav className="flex items-center gap-1.5 px-4 pt-4 text-xs text-muted-foreground md:px-12 md:pt-6 lg:px-20" aria-label="Breadcrumb">
        <a href="/" className="hover:text-brand">Home</a><span>›</span>
        <a href="/shop?category=honey-preserves" className="hover:text-brand">Preserves</a><span>›</span>
        <span aria-current="page" className="text-foreground">Saffron &amp; Walnut</span>
      </nav>

      <MobileGallery images={PRODUCT.images} />

      <div className="grid gap-0 px-4 pt-6 md:grid-cols-[55%_45%] md:gap-12 md:px-12 md:pb-16 lg:gap-16 lg:px-20 lg:pt-10">
        <div>
          <DesktopGallery images={PRODUCT.images} />
        </div>

        <div className="pt-6 md:pt-0">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h1 className="flex-1 font-display text-[26px] font-bold leading-tight text-foreground md:text-3xl">
              {PRODUCT.name}
            </h1>
            <div className="hidden md:block"><WishlistButton /></div>
          </div>

          {PRODUCT.badge && (
            <span className="mb-2.5 inline-block rounded-md bg-accent/15 px-2.5 py-1 font-mono-price text-[11px] font-medium uppercase tracking-wide text-accent-700">
              {PRODUCT.badge}
            </span>
          )}

          <div className="mb-4 flex items-center gap-1.5">
            <StarRating rating={PRODUCT.rating} />
            <span className="text-[13px] text-muted-foreground">{PRODUCT.rating} ({PRODUCT.reviewCount} reviews)</span>
          </div>

          <div className="mb-4 flex flex-wrap items-baseline gap-2.5">
            <span className="font-mono-price text-2xl font-medium text-brand md:text-[28px]">{fmt(PRODUCT.price)}</span>
            {PRODUCT.originalPrice && (
              <>
                <span className="font-mono-price text-[15px] text-muted-foreground line-through">{fmt(PRODUCT.originalPrice)}</span>
                <span className="rounded-md bg-red-50 px-2 py-0.5 font-mono-price text-xs text-red-800">
                  {pct(PRODUCT.originalPrice, PRODUCT.price)}% off
                </span>
              </>
            )}
          </div>

          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">{PRODUCT.shortDesc}</p>

          <div className="mb-6 flex flex-wrap gap-1.5">
            {PRODUCT.tags.map((t) => (
              <span key={t} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{t}</span>
            ))}
          </div>

          <div className="mb-6 flex items-center gap-3">
            <QuantityStepper qty={qty} setQty={setQty} />
            <div className="md:hidden"><WishlistButton /></div>
          </div>

          <AddToCartBtn variant="inline" />

          <div className="my-6 h-px bg-border" />

          <Accordion title="Nutrition facts">
            <table className="w-full border-collapse" aria-label="Nutrition information">
              <tbody>
                {PRODUCT.nutrition.map((row) => (
                  <tr key={row.label} className="border-t border-border">
                    <td className="py-1.5 text-[13px]">{row.label}</td>
                    <td className="py-1.5 text-right font-mono-price text-[13px] text-foreground">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Accordion>
          <Accordion title="Ingredients"><p>{PRODUCT.ingredients}</p></Accordion>
          <Accordion title="Delivery & shelf life">
            <p>Shipped cold-chain in 24–48 hours across India. Best before 12 months from production. Refrigerate after opening; consume within 6 weeks.</p>
          </Accordion>
        </div>
      </div>

      {/* Reviews */}
      <section aria-labelledby="reviews-heading" className="mt-12 mb-12 px-4 md:px-12 lg:px-20">
        <div className="mb-1 flex items-baseline gap-2.5">
          <h2 className="font-display text-xl font-semibold" id="reviews-heading">Reviews</h2>
          <span className="font-mono-price text-lg font-medium text-accent">{PRODUCT.rating}</span>
          <span className="text-[13px] text-muted-foreground">/ 5 — {PRODUCT.reviewCount} ratings</span>
        </div>
        <div className="mb-5"><StarRating rating={PRODUCT.rating} size={18} /></div>
        <div className="grid gap-4 md:grid-cols-2">
          {REVIEWS.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>
      </section>

      {/* Related */}
      <section aria-labelledby="related-heading" className="mb-8">
        <h2 className="mb-4 px-4 font-display text-xl font-semibold md:px-12 lg:px-20" id="related-heading">
          You may also like
        </h2>
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:px-12 lg:px-20 [&::-webkit-scrollbar]:hidden" role="list">
          {RELATED.map((p) => <div key={p.id} role="listitem"><RelatedCard product={p} /></div>)}
        </div>
      </section>

      {/* Sticky CTA — mobile only */}
      <div className="fixed inset-x-0 bottom-0 z-40 px-4 pb-6 pt-3 bg-gradient-to-t from-background via-background/90 to-transparent md:hidden">
        <AddToCartBtn variant="sticky" />
      </div>
    </div>
  );
}