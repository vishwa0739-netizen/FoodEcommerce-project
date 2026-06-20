'use client'

import { useState, useEffect, useRef, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react'
import { primaryNav } from '@/lib/navigation'
import { categories } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/cart/CartContext'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

// `categories` (from '@/lib/data') is expected to contain
// objects shaped like { id: 'oils-vinegar', name: 'Oils & Vinegars', slug: 'oils-vinegar' }.
// We build hrefs here instead of trusting hardcoded category
// page links, so every pill always resolves to the real
// filtering route — /shop?category=<slug> — and never 404s.
const pills = [
  { id: 'all', name: 'All Products', slug: undefined as string | undefined },
  ...categories.map((c: { id: string; name: string; slug?: string }) => ({
    id: c.id,
    name: c.name,
    slug: c.slug ?? c.id,
  })),
]

function pillHref(slug?: string) {
  return slug ? `/shop?category=${slug}` : '/shop'
}

function IconButton({
  label,
  children,
  href,
  badge,
}: {
  label: string
  children: React.ReactNode
  href: string
  badge?: number
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent/15 hover:text-brand',
        focusRing,
      )}
    >
      {children}
      {badge ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 font-mono-price text-[10px] font-medium text-primary-foreground">
          {badge}
        </span>
      ) : null}
    </Link>
  )
}

// Cart is a global drawer (see CartDrawer.tsx, mounted in layout.tsx),
// NOT a route — so this is a <button> that opens it, never a <Link>.
function CartIconButton() {
  const { summary, toggleCart } = useCart()

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label={`Cart, ${summary.itemCount} item${summary.itemCount === 1 ? '' : 's'}`}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-accent/15 hover:text-brand',
        focusRing,
      )}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      {summary.itemCount > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 font-mono-price text-[10px] font-medium text-primary-foreground">
          {summary.itemCount}
        </span>
      ) : null}
    </button>
  )
}

export function Navbar() {
  const router = useRouter()
  const [activePill, setActivePill] = useState('all')
  const [query, setQuery] = useState('')

  // Keep the search box / active pill in sync if the user is
  // already on /shop?q=...&category=... (e.g. via browser
  // back/forward). Read on mount + on every client-side
  // navigation, without useSearchParams (which would force
  // the whole app into dynamic rendering since Navbar mounts
  // on every page through the root layout).
  useEffect(() => {
    function syncFromUrl() {
      const params = new URLSearchParams(window.location.search)
      setQuery(params.get('q') ?? '')
      setActivePill(params.get('category') ?? 'all')
    }
    syncFromUrl()
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = query.trim()
    router.push(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : '/shop')
  }

  return (
    <header className="relative z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 lg:sticky lg:top-0">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        {/* Top row: eyebrow + wordmark, pill buttons / desktop nav */}
        <div className="flex items-center justify-between gap-4 pt-4 md:pt-6">
          <Link href="/" className={cn('flex flex-col leading-none', focusRing)}>
            <span className="font-mono-price text-[10px] uppercase tracking-[0.25em] text-accent-600 md:text-xs">
              Handcrafted For You
            </span>
            <span className="mt-1 font-display text-2xl font-semibold tracking-tight text-brand md:text-3xl">
              Suresh <span className="text-accent">Foods.</span>
            </span>
          </Link>

          {/* Desktop primary nav */}
          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:text-brand',
                  focusRing,
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Pill buttons (match reference) */}
            <Link
              href="/shop"
              className={cn(
                'hidden items-center gap-1.5 rounded-full border border-brand/30 bg-brand/5 px-3.5 py-2 text-xs font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/10 sm:inline-flex',
                focusRing,
              )}
            >
              Detail
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              href="/admin"
              className={cn(
                'hidden items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-2 text-xs font-semibold text-accent-700 transition-colors hover:border-accent hover:bg-accent/20 sm:inline-flex',
                focusRing,
              )}
            >
              Admin
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            {/* Desktop-only utility icons */}
            <span className="hidden lg:inline-flex">
              <IconButton label="Wishlist" href="/account/wishlist">
                <Heart className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </span>
            <span className="hidden lg:inline-flex">
              <IconButton label="Account" href="/account">
                <User className="h-5 w-5" aria-hidden="true" />
              </IconButton>
            </span>
            <CartIconButton />
          </div>
        </div>

        {/* Search row — this is the ONLY search bar in the
            app now. It always navigates to /shop?q=... rather
            than rendering results inline, so there's no second
            search input competing with it on the shop page. */}
        <div className="py-4">
          <form role="search" className="relative w-full" onSubmit={handleSearchSubmit}>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search oils, honey, chocolate…"
              aria-label="Search products"
              className={cn(
                'h-12 w-full rounded-full border border-border bg-card pl-12 pr-14 text-sm text-foreground shadow-sm placeholder:text-muted-foreground transition-colors',
                'focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
              )}
            />
            <Link
              href="/shop"
              aria-label="Open filters"
              className={cn(
                'absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent/15 hover:text-brand',
                focusRing,
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            </Link>
          </form>
        </div>
      </div>

      <CategoryPills active={activePill} onSelect={setActivePill} />
    </header>
  )
}

function CategoryPills({
  active,
  onSelect,
}: {
  active: string
  onSelect: (id: string) => void
}) {
  const scrollerRef = useRef<HTMLUListElement>(null)

  return (
    <div className="border-t border-border/60 bg-background/60">
      <ul
        ref={scrollerRef}
        className="mx-auto flex max-w-7xl snap-x gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:px-8 [&::-webkit-scrollbar]:hidden"
        aria-label="Browse categories"
      >
        {pills.map((pill) => {
          const isActive = active === (pill.slug ?? 'all')
          return (
            <li key={pill.id} className="snap-start">
              <Link
                href={pillHref(pill.slug)}
                onClick={() => onSelect(pill.slug ?? 'all')}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium backdrop-blur transition-colors',
                  focusRing,
                  isActive
                    ? 'border-brand bg-brand/10 text-brand'
                    : 'border-border bg-card/70 text-muted-foreground hover:border-accent hover:text-brand',
                )}
              >
                {pill.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}