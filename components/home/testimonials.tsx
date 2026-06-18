'use client'

import { useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { testimonials } from '@/lib/data'
import { cn } from '@/lib/utils'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function Testimonials() {
  const scrollerRef = useRef<HTMLUListElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    const card = el.querySelector('li')
    const amount = card ? (card as HTMLElement).offsetWidth + 16 : el.clientWidth
    el.scrollBy({ left: amount * dir, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono-price text-[10px] uppercase tracking-[0.25em] text-accent-600 md:text-xs">
            Loved By Our Customers
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-brand md:text-3xl">
            From the table
          </h2>
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            type="button"
            aria-label="Previous testimonials"
            onClick={() => scrollBy(-1)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-accent hover:text-brand',
              focusRing,
            )}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next testimonials"
            onClick={() => scrollBy(1)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-accent hover:text-brand',
              focusRing,
            )}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={scrollerRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <li
            key={t.id}
            className="w-full shrink-0 snap-start md:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)]"
          >
            <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <Quote className="h-7 w-7 text-accent" aria-hidden="true" />
              <div className="mt-4 flex" aria-label={`Rated ${t.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-4 w-4',
                      i < t.rating ? 'fill-accent text-accent' : 'fill-none text-border',
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-pretty leading-relaxed text-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <p className="font-display font-semibold text-brand">{t.author}</p>
                <p className="font-mono-price text-xs uppercase tracking-wider text-muted-foreground">
                  {t.location}
                </p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
