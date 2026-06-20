import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { categories } from '@/lib/data'
import { cn } from '@/lib/utils'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function CategoryCard({
  name,
  href,
  image,
}: {
  name: string
  href: string
  image: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col gap-3 rounded-2xl border border-transparent p-2 transition-colors hover:border-accent',
        focusRing,
      )}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 16vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="text-center font-display text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-brand md:text-base">
        {name}
      </p>
    </Link>
  )
}

export function CategoryCards() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono-price text-[10px] uppercase tracking-[0.25em] text-accent-600 md:text-xs">
            Browse The Shelves
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-brand md:text-3xl">
            Shop by category
          </h2>
        </div>
        {/*
          FIX: was href="/categories" — that route doesn't exist
          anywhere in app/, so this 404'd. /shop is the real
          "browse everything" page, same fix pattern as every
          other category link in this project.
        */}
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

      {/* Mobile: horizontal snap-scroll, ~2.2 cards visible */}
      <ul className="mt-6 flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => (
          <li key={cat.id} className="w-[44%] shrink-0 snap-start">
            <CategoryCard {...cat} />
          </li>
        ))}
      </ul>

      {/* Tablet: 3 cols / Desktop: 6 cols */}
      <ul className="mt-6 hidden grid-cols-3 gap-4 md:grid lg:grid-cols-6">
        {categories.map((cat) => (
          <li key={cat.id}>
            <CategoryCard {...cat} />
          </li>
        ))}
      </ul>
    </section>
  )
}