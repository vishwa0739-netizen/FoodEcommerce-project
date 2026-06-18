import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8 lg:py-12">
      {/* Mobile & tablet: overlaid image with stacked text. Desktop: split layout. */}
      <div className="overflow-hidden rounded-3xl lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-0 lg:rounded-none lg:bg-transparent">
        {/* Text — desktop left column */}
        <div className="hidden lg:flex lg:flex-col lg:justify-center lg:rounded-l-3xl lg:bg-brand lg:p-16">
          <p className="font-mono-price text-xs uppercase tracking-[0.25em] text-accent-200">
            Sourced From Named Producers
          </p>
          <h1 className="mt-6 text-balance font-display text-5xl font-semibold leading-[1.05] text-primary-foreground xl:text-6xl">
            A pantry worth the table.
          </h1>
          <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-primary-foreground/80">
            Premium artisan food and gourmet provisions — delivered with care to
            your door.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/shop"
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-400 ${focusRing} focus-visible:ring-offset-brand`}
            >
              Shop the collection
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/story"
              className={`inline-flex h-12 items-center justify-center rounded-full border border-primary-foreground/30 px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 ${focusRing} focus-visible:ring-offset-brand`}
            >
              Our story
            </Link>
          </div>
        </div>

        {/* Image with overlay (mobile/tablet) — plain image (desktop right) */}
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-auto lg:rounded-r-3xl lg:overflow-hidden">
          <Image
            src="/images/hero-spread.png"
            alt="An artisan gourmet spread of olive oil, honey, chocolate, spices and fresh figs on cream linen"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />

          {/* Overlay content shown only on mobile/tablet */}
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-brand-900/85 via-brand-900/30 to-transparent p-6 sm:p-8 lg:hidden">
            <p className="font-mono-price text-[10px] uppercase tracking-[0.25em] text-accent-200 sm:text-xs">
              Sourced From Named Producers
            </p>
            <h1 className="mt-3 max-w-xs text-balance font-display text-3xl font-semibold leading-tight text-primary-foreground sm:max-w-md sm:text-4xl">
              A pantry worth the table.
            </h1>
            <p className="mt-3 hidden max-w-md text-pretty text-base leading-relaxed text-primary-foreground/85 sm:block">
              Premium artisan food and gourmet provisions — delivered with care.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-400 ${focusRing}`}
              >
                Shop the collection
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/story"
                className={`inline-flex h-12 items-center justify-center rounded-full border border-primary-foreground/40 px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10 ${focusRing}`}
              >
                Our story
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
