"use client";

import { useState, useRef, useCallback, ReactNode, CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NutritionRow { label: string; value: string; }
interface Product {
  id: string; name: string; shortDesc: string; price: number;
  originalPrice: number | null; rating: number; reviewCount: number;
  badge: string; images: string[]; nutrition: NutritionRow[];
  ingredients: string; tags: string[];
}
interface Review { id: number; name: string; rating: number; date: string; text: string; avatar: string; }
interface RelatedProduct { id: string; name: string; price: number; originalPrice: number | null; image: string; }

// ─── Dummy data ───────────────────────────────────────────────────────────────
const PRODUCT: Product = {
  id: "saffron-walnut-preserve",
  name: "Saffron & Walnut Artisan Preserve",
  shortDesc:
    "Sun-dried Kashmiri walnuts slow-cooked with hand-picked saffron threads and raw forest honey. No preservatives, no shortcuts — just 72 hours of craft.",
  price: 1290,
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <span className="star-row" aria-label={`${rating} out of 5 stars`}>
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

// ─── Mobile gallery ───────────────────────────────────────────────────────────
function MobileGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  const startX = useRef<number | null>(null);

  const go = useCallback(
    (dir: number) => setActive((p) => Math.max(0, Math.min(images.length - 1, p + dir))),
    [images.length]
  );

  return (
    <div className="mob-gallery" aria-label="Product images">
      <div
        className="mob-gallery__track"
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
            className="mob-gallery__img" loading={i === 0 ? "eager" : "lazy"} />
        ))}
      </div>
      <div className="mob-gallery__dots" aria-hidden="true">
        {images.map((_, i) => (
          <button key={i}
            className={`mob-gallery__dot${i === active ? " mob-gallery__dot--active" : ""}`}
            onClick={() => setActive(i)} />
        ))}
      </div>
    </div>
  );
}

// ─── Desktop gallery ──────────────────────────────────────────────────────────
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

  // CSS custom properties for zoom — cast to allow unknown CSS vars
  const zoomStyle = zoom
    ? ({ "--zx": `${zoomPos.x}%`, "--zy": `${zoomPos.y}%` } as CSSProperties)
    : undefined;

  return (
    <div className="desk-gallery">
      <div className="desk-gallery__thumbs">
        {images.map((src, i) => (
          <button key={i}
            className={`desk-gallery__thumb${i === active ? " desk-gallery__thumb--active" : ""}`}
            onClick={() => setActive(i)} aria-label={`View image ${i + 1}`}>
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      <div
        className={`desk-gallery__main${zoom ? " desk-gallery__main--zoom" : ""}`}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
        onMouseMove={handleMouseMove}
        style={zoomStyle}
        aria-label="Hover to zoom"
      >
        <img ref={imgRef} src={images[active]} alt="Product main view" className="desk-gallery__main-img" />
        {zoom && (
          <div className="desk-gallery__zoom-overlay"
            style={{ backgroundImage: `url(${images[active]})`, backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%` }} />
        )}
      </div>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion">
      <button className="accordion__trigger" onClick={() => setOpen((p) => !p)} aria-expanded={open}>
        <span>{title}</span>
        <svg className={`accordion__chevron${open ? " accordion__chevron--open" : ""}`}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="accordion__body">{children}</div>}
    </div>
  );
}

// ─── Quantity stepper ─────────────────────────────────────────────────────────
function QuantityStepper({ qty, setQty }: { qty: number; setQty: React.Dispatch<React.SetStateAction<number>> }) {
  return (
    <div className="stepper" role="group" aria-label="Quantity">
      <button className="stepper__btn" onClick={() => setQty((q) => Math.max(1, q - 1))}
        aria-label="Decrease quantity" disabled={qty <= 1}>−</button>
      <span className="stepper__val" aria-live="polite">{qty}</span>
      <button className="stepper__btn" onClick={() => setQty((q) => Math.min(12, q + 1))}
        aria-label="Increase quantity" disabled={qty >= 12}>+</button>
    </div>
  );
}

// ─── Wishlist button ──────────────────────────────────────────────────────────
function WishlistButton({ size = "md" }: { size?: "sm" | "md" }) {
  const [wished, setWished] = useState(false);
  const iconSize = size === "sm" ? 18 : 22;
  return (
    <button
      className={`wishlist-btn wishlist-btn--${size}${wished ? " wishlist-btn--active" : ""}`}
      onClick={() => setWished((p) => !p)}
      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24"
        fill={wished ? "#691626" : "none"} stroke={wished ? "#691626" : "currentColor"}
        strokeWidth="1.8" className="wishlist-btn__icon" aria-hidden="true">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}

// ─── Add to Cart ──────────────────────────────────────────────────────────────
type ATCState = "idle" | "loading" | "added";

function AddToCartBtn({ qty, variant = "inline" }: { qty: number; variant?: "inline" | "sticky" }) {
  const [state, setState] = useState<ATCState>("idle");
  const handleClick = () => {
    setState("loading");
    setTimeout(() => { setState("added"); setTimeout(() => setState("idle"), 2200); }, 600);
  };
  return (
    <button
      className={`atc-btn atc-btn--${variant} atc-btn--${state}`}
      onClick={handleClick} disabled={state !== "idle"} aria-live="polite">
      {state === "idle" && `Add to cart — ${fmt(PRODUCT.price)}`}
      {state === "loading" && "Adding…"}
      {state === "added" && "✓ Added to cart"}
    </button>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────
function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__avatar">{review.avatar}</div>
        <div>
          <p className="review-card__name">{review.name}</p>
          <p className="review-card__date">{review.date}</p>
        </div>
        <div className="review-card__stars"><StarRating rating={review.rating} size={14} /></div>
      </div>
      <p className="review-card__text">{review.text}</p>
    </div>
  );
}

// ─── Related card ─────────────────────────────────────────────────────────────
function RelatedCard({ product }: { product: RelatedProduct }) {
  return (
    <div className="related-card">
      <div className="related-card__img-wrap">
        <img src={product.image} alt={product.name} className="related-card__img" loading="lazy" />
      </div>
      <div className="related-card__info">
        <p className="related-card__name">{product.name}</p>
        <div className="related-card__price-row">
          <span className="price-disc">{fmt(product.price)}</span>
          {product.originalPrice && <span className="price-orig">{fmt(product.originalPrice)}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        :root {
          --cream: #FCFCF7; --maroon: #691626; --maroon-hover: #521120;
          --gold: #bf8952; --gold-light: #f5e8d6;
          --text-primary: #1a1108; --text-secondary: #5c4a38; --text-muted: #9b8978;
          --border: #e8e0d5; --border-strong: #c8bfb4;
          --radius-sm: 6px; --radius-md: 10px; --radius-lg: 16px;
          --font-display: 'Fraunces', Georgia, serif;
          --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
          --font-mono: 'DM Mono', 'Courier New', monospace;
          --shadow-card: 0 1px 4px rgba(26,17,8,.06), 0 4px 16px rgba(26,17,8,.04);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--cream); font-family: var(--font-body); color: var(--text-primary); font-size: 15px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
        button { cursor: pointer; border: none; background: none; font-family: inherit; }
        img { display: block; width: 100%; object-fit: cover; }

        .pdp { max-width: 1440px; margin: 0 auto; padding-bottom: 96px; }
        .pdp__mobile-only { display: block; }
        .wishlist-desktop { display: none; }
        .wishlist-mobile { display: block; }

        .breadcrumb { display: flex; align-items: center; gap: 6px; padding: 16px 16px 0; font-size: 12px; color: var(--text-muted); }
        .breadcrumb a { color: var(--text-muted); text-decoration: none; }
        .breadcrumb a:hover { color: var(--maroon); }

        .badge { display: inline-block; background: var(--gold-light); color: #7a4f1a; font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: .04em; padding: 3px 10px; border-radius: var(--radius-sm); text-transform: uppercase; }

        .mob-gallery { position: relative; width: 100%; aspect-ratio: 1/1; overflow: hidden; }
        .mob-gallery__track { display: flex; height: 100%; transition: transform .32s cubic-bezier(.4,0,.2,1); }
        .mob-gallery__img { flex: 0 0 100%; height: 100%; object-fit: cover; }
        .mob-gallery__dots { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; }
        .mob-gallery__dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.55); border: none; padding: 0; transition: background .2s, width .2s; }
        .mob-gallery__dot--active { background: #fff; width: 20px; border-radius: 4px; }

        .desk-gallery { display: none; gap: 12px; align-items: flex-start; position: sticky; top: 24px; }
        .desk-gallery__thumbs { display: flex; flex-direction: column; gap: 8px; width: 80px; flex-shrink: 0; }
        .desk-gallery__thumb { width: 80px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; border: 2px solid transparent; transition: border-color .18s; padding: 0; }
        .desk-gallery__thumb img { height: 100%; object-fit: cover; }
        .desk-gallery__thumb--active, .desk-gallery__thumb:hover { border-color: var(--gold); }
        .desk-gallery__main { flex: 1; position: relative; border-radius: var(--radius-lg); overflow: hidden; cursor: zoom-in; }
        .desk-gallery__main-img { aspect-ratio: 1/1; object-fit: cover; display: block; width: 100%; transition: opacity .15s; }
        .desk-gallery__main--zoom .desk-gallery__main-img { opacity: 0; }
        .desk-gallery__zoom-overlay { position: absolute; inset: 0; background-size: 200%; background-repeat: no-repeat; }

        .pdp__info { padding: 24px 16px 0; }
        .pdp__top-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 8px; }
        .pdp__name { font-family: var(--font-display); font-size: 26px; font-weight: 700; line-height: 1.2; color: var(--text-primary); flex: 1; }
        .pdp__rating-row { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; }
        .pdp__rating-count { font-size: 13px; color: var(--text-muted); }
        .star-row { display: flex; gap: 2px; align-items: center; }

        .pdp__price-block { display: flex; align-items: baseline; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
        .price-disc { font-family: var(--font-mono); font-size: 24px; font-weight: 500; color: var(--maroon); }
        .price-orig { font-family: var(--font-mono); font-size: 15px; color: var(--text-muted); text-decoration: line-through; }
        .price-save { font-family: var(--font-mono); font-size: 12px; background: #fde8e8; color: #8b1a1a; padding: 2px 8px; border-radius: var(--radius-sm); }

        .pdp__desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 20px; }
        .pdp__tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 24px; }
        .tag { font-size: 12px; color: var(--text-secondary); border: 1px solid var(--border); padding: 4px 10px; border-radius: 100px; }

        .stepper { display: inline-flex; align-items: center; border: 1px solid var(--border-strong); border-radius: var(--radius-md); overflow: hidden; height: 44px; }
        .stepper__btn { width: 44px; height: 44px; font-size: 20px; color: var(--text-primary); display: flex; align-items: center; justify-content: center; transition: background .15s; flex-shrink: 0; }
        .stepper__btn:hover:not(:disabled) { background: var(--gold-light); }
        .stepper__btn:disabled { opacity: .35; cursor: not-allowed; }
        .stepper__val { width: 48px; text-align: center; font-family: var(--font-mono); font-size: 16px; font-weight: 500; border-left: 1px solid var(--border); border-right: 1px solid var(--border); height: 100%; display: flex; align-items: center; justify-content: center; }

        .wishlist-btn { width: 44px; height: 44px; border-radius: var(--radius-md); border: 1px solid var(--border-strong); display: flex; align-items: center; justify-content: center; transition: border-color .18s, transform .18s; color: var(--text-secondary); flex-shrink: 0; }
        .wishlist-btn:hover { border-color: var(--maroon); color: var(--maroon); }
        .wishlist-btn--active { border-color: var(--maroon); animation: heartPop .35s ease; }
        @keyframes heartPop { 0% { transform: scale(1); } 40% { transform: scale(1.22); } 70% { transform: scale(.92); } 100% { transform: scale(1); } }

        .pdp__actions-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }

        .atc-btn { width: 100%; height: 56px; border-radius: var(--radius-md); font-family: var(--font-body); font-weight: 600; font-size: 15px; letter-spacing: .02em; transition: background .18s, transform .1s; }
        .atc-btn--inline { display: none; }
        .atc-btn--idle { background: var(--maroon); color: #fff; }
        .atc-btn--idle:hover { background: var(--maroon-hover); }
        .atc-btn--loading { background: var(--maroon); color: rgba(255,255,255,.7); }
        .atc-btn--added { background: #3b7a3e; color: #fff; }
        .atc-btn:active:not(:disabled) { transform: scale(.98); }

        .pdp__sticky-cta { position: fixed; bottom: 0; left: 0; right: 0; padding: 12px 16px 24px; background: linear-gradient(to top, var(--cream) 80%, transparent); z-index: 100; }

        .divider { height: 1px; background: var(--border); margin: 24px 0; }

        .accordion { border-top: 1px solid var(--border); }
        .accordion:last-of-type { border-bottom: 1px solid var(--border); }
        .accordion__trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 16px 0; font-size: 14px; font-weight: 600; color: var(--text-primary); text-align: left; }
        .accordion__chevron { transition: transform .2s; color: var(--text-muted); flex-shrink: 0; }
        .accordion__chevron--open { transform: rotate(180deg); }
        .accordion__body { padding: 0 0 16px; font-size: 13px; color: var(--text-secondary); line-height: 1.7; }
        .nutrition-table { width: 100%; border-collapse: collapse; }
        .nutrition-table td { padding: 6px 0; border-top: 1px solid var(--border); font-size: 13px; }
        .nutrition-table td:last-child { text-align: right; font-family: var(--font-mono); font-size: 13px; color: var(--text-primary); }

        .reviews__header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 4px; padding: 0 16px; }
        .reviews__title { font-family: var(--font-display); font-size: 20px; font-weight: 600; }
        .reviews__avg { font-family: var(--font-mono); font-size: 18px; color: var(--gold); font-weight: 500; }
        .reviews__count { font-size: 13px; color: var(--text-muted); }
        .reviews__star-row { padding: 0 16px; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .reviews-grid { padding: 0 16px; display: grid; gap: 16px; }

        .review-card { padding: 16px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
        .review-card__header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .review-card__avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--gold-light); color: #7a4f1a; font-family: var(--font-mono); font-size: 12px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .review-card__name { font-size: 14px; font-weight: 600; line-height: 1.2; }
        .review-card__date { font-size: 12px; color: var(--text-muted); }
        .review-card__stars { margin-left: auto; }
        .review-card__text { font-size: 13px; color: var(--text-secondary); line-height: 1.65; }

        .related__title { font-family: var(--font-display); font-size: 20px; font-weight: 600; padding: 0 16px; margin-bottom: 16px; }
        .related__scroll { display: flex; gap: 12px; overflow-x: auto; padding: 0 16px 8px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .related__scroll::-webkit-scrollbar { display: none; }
        .related-card { flex: 0 0 160px; background: #fff; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; scroll-snap-align: start; box-shadow: var(--shadow-card); transition: box-shadow .18s; }
        .related-card:hover { box-shadow: 0 4px 20px rgba(26,17,8,.1); }
        .related-card__img-wrap { aspect-ratio: 1/1; overflow: hidden; }
        .related-card__img { transition: transform .3s; }
        .related-card:hover .related-card__img { transform: scale(1.05); }
        .related-card__info { padding: 10px; }
        .related-card__name { font-size: 12px; font-weight: 600; line-height: 1.3; margin-bottom: 6px; color: var(--text-primary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .related-card__price-row { display: flex; align-items: center; gap: 6px; }
        .related-card__price-row .price-disc { font-size: 14px; }
        .related-card__price-row .price-orig { font-size: 11px; }

        @media (min-width: 768px) {
          .mob-gallery { display: none; }
          .desk-gallery { display: flex; }
          .pdp__sticky-cta { display: none; }
          .atc-btn--inline { display: flex; align-items: center; justify-content: center; }
          .pdp__mobile-only { display: none; }
          .wishlist-desktop { display: block; }
          .wishlist-mobile { display: none; }
          .pdp__layout { display: grid; grid-template-columns: 55% 45%; gap: 0 48px; padding: 32px 48px 64px; align-items: start; }
          .pdp__info { padding: 0; }
          .pdp__name { font-size: 32px; }
          .price-disc { font-size: 28px; }
          .breadcrumb { padding: 24px 48px 8px; }
          .reviews__header, .reviews__star-row { padding: 0 48px; }
          .reviews-grid { grid-template-columns: 1fr 1fr; padding: 0 48px; }
          .related__title { padding: 0 48px; }
          .related__scroll { padding: 0 48px 8px; }
          .related-card { flex: 0 0 200px; }
        }
        @media (min-width: 1024px) {
          .pdp__layout { padding: 40px 80px 80px; gap: 0 64px; }
          .breadcrumb { padding: 28px 80px 8px; }
          .reviews__header, .reviews__star-row { padding: 0 80px; }
          .reviews-grid { padding: 0 80px; }
          .related__title { padding: 0 80px; }
          .related__scroll { padding: 0 80px 8px; }
        }
      `}</style>

      <div className="pdp">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="#">Home</a><span>›</span>
          <a href="#">Preserves</a><span>›</span>
          <span aria-current="page">Saffron &amp; Walnut</span>
        </nav>

        {/* Mobile gallery (above layout grid) */}
        <div className="pdp__mobile-only">
          <MobileGallery images={PRODUCT.images} />
        </div>

        <div className="pdp__layout">
          {/* Gallery col */}
          <div>
            <DesktopGallery images={PRODUCT.images} />
          </div>

          {/* Info col */}
          <div className="pdp__info">
            <div className="pdp__top-row">
              <h1 className="pdp__name">{PRODUCT.name}</h1>
              <div className="wishlist-desktop"><WishlistButton /></div>
            </div>

            {PRODUCT.badge && (
              <span className="badge" style={{ marginBottom: 10, display: "inline-block" }}>{PRODUCT.badge}</span>
            )}

            <div className="pdp__rating-row">
              <StarRating rating={PRODUCT.rating} />
              <span className="pdp__rating-count">{PRODUCT.rating} ({PRODUCT.reviewCount} reviews)</span>
            </div>

            <div className="pdp__price-block">
              <span className="price-disc">{fmt(PRODUCT.price)}</span>
              {PRODUCT.originalPrice && (
                <>
                  <span className="price-orig">{fmt(PRODUCT.originalPrice)}</span>
                  <span className="price-save">{pct(PRODUCT.originalPrice, PRODUCT.price)}% off</span>
                </>
              )}
            </div>

            <p className="pdp__desc">{PRODUCT.shortDesc}</p>

            <div className="pdp__tags">
              {PRODUCT.tags.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>

            <div className="pdp__actions-row">
              <QuantityStepper qty={qty} setQty={setQty} />
              <div className="wishlist-mobile"><WishlistButton /></div>
            </div>

            <AddToCartBtn qty={qty} variant="inline" />

            <div className="divider" />

            <Accordion title="Nutrition facts">
              <table className="nutrition-table" aria-label="Nutrition information">
                <tbody>
                  {PRODUCT.nutrition.map((row) => (
                    <tr key={row.label}><td>{row.label}</td><td>{row.value}</td></tr>
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
        <section aria-labelledby="reviews-heading" style={{ marginTop: 48, marginBottom: 48 }}>
          <div className="reviews__header">
            <h2 className="reviews__title" id="reviews-heading">Reviews</h2>
            <span className="reviews__avg">{PRODUCT.rating}</span>
            <span className="reviews__count">/ 5 — {PRODUCT.reviewCount} ratings</span>
          </div>
          <div className="reviews__star-row"><StarRating rating={PRODUCT.rating} size={18} /></div>
          <div className="reviews-grid">
            {REVIEWS.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        </section>

        {/* Related */}
        <section aria-labelledby="related-heading" style={{ marginBottom: 32 }}>
          <h2 className="related__title" id="related-heading">You may also like</h2>
          <div className="related__scroll" role="list">
            {RELATED.map((p) => <div key={p.id} role="listitem"><RelatedCard product={p} /></div>)}
          </div>
        </section>
      </div>

      {/* Sticky CTA — mobile only */}
      <div className="pdp__sticky-cta" aria-label="Add to cart">
        <AddToCartBtn qty={qty} variant="sticky" />
      </div>
    </>
  );
}