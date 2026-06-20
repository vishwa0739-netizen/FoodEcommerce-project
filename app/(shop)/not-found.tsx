import Link from "next/link";

export default function ShopNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono-price text-xs uppercase tracking-wider text-accent-600">
        404
      </p>
      <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
        We couldn&apos;t find that category
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        It may have moved, or the link is out of date. Try browsing everything
        we carry instead.
      </p>
      <Link
        href="/shop"
        className="mt-2 inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-700"
      >
        Shop all products
      </Link>
    </div>
  );
}