const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'

export function Newsletter() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl bg-brand px-6 py-12 text-center md:px-12 md:py-16">
        <p className="font-mono-price text-[10px] uppercase tracking-[0.25em] text-accent-200 md:text-xs">
          Join The Inner Circle
        </p>
        <h2 className="mt-4 text-balance font-display text-3xl font-semibold leading-tight text-primary-foreground md:text-4xl">
          First to the table.
        </h2>
        <p className="mt-4 max-w-md text-pretty leading-relaxed text-primary-foreground/80">
          New arrivals, seasonal drops, limited batches, and recipes — delivered
          before anyone else.
        </p>

        <form className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-home" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-home"
            type="email"
            required
            placeholder="your@email.com"
            className={`h-12 flex-1 rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-5 text-sm text-primary-foreground placeholder:text-primary-foreground/60 ${focusRing} focus-visible:border-accent focus-visible:ring-accent focus-visible:ring-offset-brand`}
          />
          <button
            type="submit"
            className={`inline-flex h-12 items-center justify-center rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent-400 ${focusRing} focus-visible:ring-offset-brand`}
          >
            Join Free
          </button>
        </form>
        <p className="mt-4 font-mono-price text-xs text-primary-foreground/60">
          No spam, ever. Unsubscribe in one click.
        </p>
      </div>
    </section>
  )
}
