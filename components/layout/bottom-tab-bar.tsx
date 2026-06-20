'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { tabItems } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { useCart } from '@/components/cart/CartContext'

export function BottomTabBar() {
  const pathname = usePathname()
  const { summary, toggleCart } = useCart()

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {tabItems.map((item) => {
          const isCart = item.href === '/cart'
          // Cart has no route of its own (it's a drawer), so it's
          // never "active" via pathname — it just toggles open/closed.
          const active = isCart
            ? false
            : item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon

          const sharedClassName = cn(
            'relative flex w-full flex-col items-center gap-1 py-2 text-[11px] font-medium transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset',
            active ? 'text-brand' : 'text-muted-foreground hover:text-brand',
          )

          const content = (
            <>
              <span className="relative">
                <Icon
                  className="h-5 w-5"
                  strokeWidth={active ? 2.4 : 2}
                  aria-hidden="true"
                />
                {isCart && summary.itemCount > 0 ? (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 font-mono-price text-[9px] font-medium text-primary-foreground">
                    {summary.itemCount}
                  </span>
                ) : null}
              </span>
              {item.label}
              {active ? (
                <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-brand" />
              ) : null}
            </>
          )

          return (
            <li key={item.href} className="flex-1">
              {isCart ? (
                <button
                  type="button"
                  onClick={toggleCart}
                  aria-label="Cart"
                  className={sharedClassName}
                >
                  {content}
                </button>
              ) : (
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                  className={sharedClassName}
                >
                  {content}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}