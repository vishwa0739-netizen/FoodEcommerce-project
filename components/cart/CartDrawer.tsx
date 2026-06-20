'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { X, ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useCart } from './CartContext'
import { CartLineItem } from './CartLineItem'

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

function EmptyCart({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-6">
      <div className="w-24 h-24 rounded-full bg-[#691626]/8 flex items-center justify-center">
        <ShoppingBag className="text-[#691626]/40" size={40} strokeWidth={1.5} />
      </div>
      <div>
        <p className="font-display text-xl font-semibold text-[#1a0a0d]">
          Your cart is empty
        </p>
        <p className="font-body text-sm text-[#691626]/50 mt-2 leading-relaxed">
          Looks like you haven't added any items yet.
          Explore our gourmet collection.
        </p>
      </div>
      <button
        onClick={() => { onClose(); router.push('/shop') }}
        className="inline-flex items-center gap-2 px-8 py-3
                   bg-[#691626] text-[#FCFCF7]
                   font-body font-semibold text-sm rounded-full
                   hover:bg-[#7d1b2e] active:scale-95 transition-all"
      >
        Browse Shop <ArrowRight size={16} />
      </button>
    </div>
  )
}

function SummaryRow({ label, value, accent }: {
  label: string; value: string; accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className={`font-body text-sm
        ${accent ? 'text-[#691626] font-semibold' : 'text-[#1a0a0d]/60'}`}>
        {label}
      </span>
      <span className={`font-mono-price text-sm font-semibold
        ${accent ? 'text-[#691626]' : 'text-[#1a0a0d]'}`}>
        {value}
      </span>
    </div>
  )
}

export function CartDrawer() {
  const { state, summary, closeCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = state.isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [state.isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeCart])

  if (!state.isOpen) return null

  const isEmpty = state.items.length === 0

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        aria-hidden
        className="fixed inset-0 z-40 bg-[#1a0a0d]/50 backdrop-blur-sm animate-fadeIn"
      />

      {/*
        Mobile (< 768px)        → bottom sheet, slides up
        Tablet + Desktop (≥768) → right panel, slides in from right
      */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="
          fixed z-50 bg-[#FCFCF7] flex flex-col shadow-2xl

          bottom-0 left-0 right-0 max-h-[92vh]
          rounded-t-[28px] animate-slideUp

          tablet:bottom-0 tablet:top-0 tablet:left-auto tablet:right-0
          tablet:w-[420px] tablet:max-h-full tablet:h-screen
          tablet:rounded-none tablet:rounded-l-[24px]
          tablet:animate-slideInRight
        "
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 tablet:hidden" aria-hidden>
          <div className="w-10 h-1 rounded-full bg-[#691626]/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
                        border-b border-[#bf8952]/20">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#691626]" size={20} strokeWidth={2} />
            <h2 className="font-display text-lg font-semibold text-[#1a0a0d]">
              Your Cart
            </h2>
            {summary.itemCount > 0 && (
              <span className="min-w-[22px] h-[22px] px-1.5 flex items-center justify-center
                               rounded-full bg-[#691626] text-[#FCFCF7]
                               font-mono-price text-[11px] font-bold">
                {summary.itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center rounded-full
                       hover:bg-[#691626]/8 transition-colors
                       text-[#691626]/60 hover:text-[#691626]"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Free delivery banner */}
        {!isEmpty && summary.deliveryFee > 0 && (
          <div className="mx-6 mt-4 px-4 py-2.5 rounded-xl
                          bg-[#bf8952]/12 border border-[#bf8952]/30
                          flex items-center gap-2">
            <Tag size={14} className="text-[#bf8952] flex-shrink-0" />
            <p className="font-body text-xs text-[#691626]">
              Add{' '}
              <span className="font-semibold font-mono-price">
                {formatPrice(499 - summary.subtotal)}
              </span>{' '}
              more for free delivery
            </p>
          </div>
        )}

        {isEmpty && (
          <div className="mx-6 mt-4 px-4 py-2.5 rounded-xl
                          bg-[#bf8952]/12 border border-[#bf8952]/30">
            <p className="font-body text-xs text-center text-[#691626]">
              Free delivery on orders above{' '}
              <span className="font-semibold font-mono-price">₹499</span>
            </p>
          </div>
        )}

        {/* Scrollable item list */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6">
          {isEmpty ? (
            <EmptyCart onClose={closeCart} />
          ) : (
            <ul aria-label="Cart items">
              {state.items.map((item) => (
                <CartLineItem key={item.id} item={item} />
              ))}
            </ul>
          )}
        </div>

        {/* Sticky footer */}
        {!isEmpty && (
          <div className="border-t border-[#bf8952]/20 px-6 pt-4 pb-6 space-y-3 safe-area-bottom">
            <div className="space-y-1">
              <SummaryRow label="Subtotal" value={formatPrice(summary.subtotal)} />
              {summary.discount > 0 && (
                <SummaryRow
                  label="You save"
                  value={`-${formatPrice(summary.discount)}`}
                  accent
                />
              )}
              <SummaryRow
                label="Delivery"
                value={summary.deliveryFee === 0 ? 'FREE' : formatPrice(summary.deliveryFee)}
                accent={summary.deliveryFee === 0}
              />
              <div className="border-t border-[#bf8952]/20 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-body font-bold text-base text-[#1a0a0d]">Total</span>
                  <span className="font-mono-price text-lg font-bold text-[#691626]">
                    {formatPrice(summary.total)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => { closeCart(); router.push('/checkout') }}
              className="w-full py-4 bg-[#691626] text-[#FCFCF7]
                         font-body font-bold text-base rounded-2xl
                         flex items-center justify-center gap-2
                         hover:bg-[#7d1b2e] active:scale-[0.98] transition-all
                         shadow-lg shadow-[#691626]/30"
            >
              Proceed to Checkout <ArrowRight size={18} strokeWidth={2.5} />
            </button>

            <button
              onClick={closeCart}
              className="w-full py-3 text-[#691626]/70 font-body text-sm
                         font-medium hover:text-[#691626] transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  )
}