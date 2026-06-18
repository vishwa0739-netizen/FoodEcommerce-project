import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { featuredProducts } from '@/lib/data'
import { ProductCard } from '@/components/product-card'
import { cn } from '@/lib/utils'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function FeaturedProducts() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono-price text-[10px] uppercase tracking-[0.25em] text-accent-600 md:text-xs">
            Freshly Added This Season
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-brand md:text-3xl">
            New arrivals
          </h2>
        </div>
        <Link
          href="/shop"
          className={cn(
            'inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand transition-colors hover:text-accent-700',
            focusRing,
          )}
        >
          See all
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* 2 cols mobile, 3 tablet, 4 desktop */}
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {featuredProducts.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}
