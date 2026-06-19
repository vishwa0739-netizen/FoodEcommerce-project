'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import type { CartItem } from '@/types/cart'
import { useCart } from './CartContext'

interface CartLineItemProps {
  item: CartItem
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function CartLineItem({ item }: CartLineItemProps) {
  const { removeItem, updateQty } = useCart()

  return (
    <li className="flex gap-4 py-4 border-b border-[#bf8952]/20 last:border-0 animate-fadeIn">
      {/* Product image */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-[#bf8952]/10">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="80px"
        />
        {item.badge && (
          <span className="absolute top-1 left-1 text-[9px] font-semibold tracking-wider
                           font-mono-price text-[#FCFCF7] bg-[#691626]
                           px-1.5 py-0.5 rounded-full leading-none">
            {item.badge}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-sm font-semibold text-[#1a0a0d] leading-snug line-clamp-2">
            {item.name}
          </p>
          <button
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full
                       hover:bg-[#691626]/10 transition-colors
                       text-[#691626]/60 hover:text-[#691626]"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>

        <p className="text-xs text-[#691626]/50 font-body mt-0.5">{item.category}</p>

        {/* Price + Qty stepper */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="font-mono-price text-sm font-semibold text-[#691626]">
              {formatPrice(item.price * item.quantity)}
            </span>
            {item.originalPrice && (
              <span className="font-mono-price text-xs text-[#691626]/40 line-through">
                {formatPrice(item.originalPrice * item.quantity)}
              </span>
            )}
          </div>

          {/* Stepper */}
          <div className="flex items-center border border-[#bf8952]/40 rounded-full overflow-hidden">
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center text-[#691626]
                         hover:bg-[#691626] hover:text-[#FCFCF7]
                         transition-colors active:scale-95"
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span className="w-8 text-center font-mono-price text-sm font-semibold
                             text-[#1a0a0d] select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.maxQuantity}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center text-[#691626]
                         hover:bg-[#691626] hover:text-[#FCFCF7]
                         transition-colors active:scale-95
                         disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}