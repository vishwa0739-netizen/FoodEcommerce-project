'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Star, Plus } from 'lucide-react'
import type { Product } from '@/lib/data'
import { cn } from '@/lib/utils'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function Stars({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i < rating ? 'fill-accent text-accent' : 'fill-none text-border',
            )}
            aria-hidden="true"
          />
        ))}
      </div>
      <span className="font-mono-price text-[11px] text-muted-foreground">
        ({reviews})
      </span>
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const [wishlisted, setWishlisted] = useState(false)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-accent hover:shadow-md">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 font-mono-price text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          aria-label={
            wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`
          }
          aria-pressed={wishlisted}
          onClick={() => setWishlisted((v) => !v)}
          className={cn(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition-colors hover:text-brand',
            focusRing,
          )}
        >
          <Heart
            className={cn('h-4 w-4', wishlisted && 'fill-brand text-brand')}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-mono-price text-[10px] uppercase tracking-wider text-accent-600">
          {product.category}
        </p>
        <h3 className="mt-1 font-display text-base font-semibold leading-snug text-foreground">
          <Link href={`/product/${product.id}`} className={cn('hover:text-brand', focusRing)}>
            {product.name}
          </Link>
        </h3>

        <div className="mt-2">
          <Stars rating={product.rating} reviews={product.reviews} />
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono-price text-base font-medium text-brand">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAt ? (
              <span className="font-mono-price text-xs text-muted-foreground line-through">
                ${product.compareAt.toFixed(2)}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full bg-brand text-primary-foreground transition-colors hover:bg-brand-700',
              focusRing,
            )}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  )
}
