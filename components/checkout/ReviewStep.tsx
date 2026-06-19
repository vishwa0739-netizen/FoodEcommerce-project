'use client'

import Image from 'next/image'
import { MapPin, CreditCard, Smartphone, Building2, Wallet, Edit2, ShieldCheck } from 'lucide-react'
import type { Address, PaymentDetails, CartItem, CartSummary } from '@/types/cart'

interface ReviewStepProps {
  address: Address
  payment: PaymentDetails
  items: CartItem[]
  summary: CartSummary
  onPlaceOrder: () => void
  onBack: () => void
  isProcessing: boolean
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n)
}

const PAY_ICONS: Record<string, React.ReactNode> = {
  upi:        <Smartphone size={16} strokeWidth={1.5} />,
  card:       <CreditCard  size={16} strokeWidth={1.5} />,
  netbanking: <Building2   size={16} strokeWidth={1.5} />,
  wallet:     <Wallet      size={16} strokeWidth={1.5} />,
}

function payLabel(p: PaymentDetails) {
  if (p.method === 'upi')        return `UPI — ${p.upi?.vpa}`
  if (p.method === 'card')       return `Card ending ****${p.card?.number.slice(-4)}`
  if (p.method === 'netbanking') return `Net Banking — ${p.netbanking?.bank}`
  if (p.method === 'wallet')     return `${p.wallet?.provider} Wallet`
  return ''
}

function SectionCard({ title, onEdit, children }: {
  title: string; onEdit?: () => void; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-[#bf8952]/25 bg-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#bf8952]/15">
        <h3 className="font-body text-xs font-bold text-[#1a0a0d]/50 uppercase tracking-widest">
          {title}
        </h3>
        {onEdit && (
          <button onClick={onEdit}
            className="flex items-center gap-1 text-[#691626] font-body text-xs font-semibold hover:underline">
            <Edit2 size={12} /> Edit
          </button>
        )}
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  )
}

export function ReviewStep({
  address, payment, items, summary, onPlaceOrder, onBack, isProcessing
}: ReviewStepProps) {
  return (
    <div className="space-y-4">
      <SectionCard title="Deliver To" onEdit={onBack}>
        <div className="flex gap-3">
          <MapPin size={16} className="text-[#691626] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-body text-sm font-semibold text-[#1a0a0d]">{address.fullName}</p>
            <p className="font-body text-xs text-[#1a0a0d]/60 mt-1 leading-relaxed">
              {address.addressLine1}{address.addressLine2 && `, ${address.addressLine2}`}
              {address.landmark && `, ${address.landmark}`}<br />
              {address.city}, {address.state} – {address.pincode}
            </p>
            <p className="font-mono-price text-xs text-[#691626]/60 mt-1">+91 {address.phone}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Payment" onEdit={onBack}>
        <div className="flex items-center gap-3">
          <span className="text-[#691626]">{PAY_ICONS[payment.method]}</span>
          <p className="font-body text-sm text-[#1a0a0d]">{payLabel(payment)}</p>
        </div>
      </SectionCard>

      <SectionCard title={`Items (${items.reduce((n, i) => n + i.quantity, 0)})`}>
        <ul className="space-y-3">
          {items.map(item => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#bf8952]/10">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm font-semibold text-[#1a0a0d] line-clamp-1">{item.name}</p>
                <p className="font-body text-xs text-[#1a0a0d]/40">Qty: {item.quantity}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-mono-price text-sm font-bold text-[#691626]">
                  {formatPrice(item.price * item.quantity)}
                </p>
                {item.originalPrice && (
                  <p className="font-mono-price text-xs text-[#1a0a0d]/30 line-through">
                    {formatPrice(item.originalPrice * item.quantity)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Price breakdown */}
      <div className="rounded-2xl border border-[#bf8952]/25 bg-white px-4 py-4 space-y-2">
        <div className="flex justify-between font-body text-sm text-[#1a0a0d]/60">
          <span>Subtotal</span><span className="font-mono-price">{formatPrice(summary.subtotal)}</span>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between font-body text-sm text-[#691626] font-semibold">
            <span>Savings</span><span className="font-mono-price">−{formatPrice(summary.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-body text-sm text-[#1a0a0d]/60">
          <span>Delivery</span>
          <span className={`font-mono-price ${summary.deliveryFee === 0 ? 'text-[#691626] font-semibold' : ''}`}>
            {summary.deliveryFee === 0 ? 'FREE' : formatPrice(summary.deliveryFee)}
          </span>
        </div>
        <div className="border-t border-[#bf8952]/20 pt-2 flex justify-between">
          <span className="font-body font-bold text-base text-[#1a0a0d]">Total</span>
          <span className="font-mono-price text-lg font-bold text-[#691626]">{formatPrice(summary.total)}</span>
        </div>
      </div>

      <button onClick={onPlaceOrder} disabled={isProcessing}
        className="w-full py-4 bg-[#691626] text-[#FCFCF7] font-body font-bold text-base
                   rounded-2xl hover:bg-[#7d1b2e] active:scale-[0.98] transition-all
                   shadow-lg shadow-[#691626]/25 flex items-center justify-center gap-2
                   disabled:opacity-60 disabled:cursor-not-allowed">
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
            Processing…
          </>
        ) : (
          <><ShieldCheck size={18} strokeWidth={2.5} /> Place Order — {formatPrice(summary.total)}</>
        )}
      </button>

      <p className="text-center font-body text-xs text-[#1a0a0d]/40 leading-relaxed">
        By placing your order you agree to our{' '}
        <a href="/terms" className="underline text-[#691626]/60">Terms</a> and{' '}
        <a href="/privacy" className="underline text-[#691626]/60">Privacy Policy</a>.
      </p>

      <button type="button" onClick={onBack}
        className="w-full py-3 text-[#691626]/60 font-body text-sm hover:text-[#691626] transition-colors">
        ← Change Payment Method
      </button>
    </div>
  )
}