'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import type { Address, PaymentDetails, CheckoutStep, CartItem, CartSummary } from '@/types/cart'
import { StepIndicator } from '@/components/checkout/StepIndicator'
import { AddressStep }   from '@/components/checkout/AddressStep'
import { PaymentStep }   from '@/components/checkout/PaymentStep'
import { ReviewStep }    from '@/components/checkout/ReviewStep'

// ── Demo data — replace with useCart() once backend is wired ─────────────────
const DEMO_ITEMS: CartItem[] = [
  {
    id: 'ci1', productId: 'p1',
    name: 'Artisan Mango Pickle — Traditional Andhra Style',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
    price: 349, originalPrice: 450, quantity: 2,
    maxQuantity: 10, category: 'Pickles & Preserves',
  },
  {
    id: 'ci2', productId: 'p2',
    name: 'Cold-Pressed Coconut Oil — 1 Litre',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    price: 599, quantity: 1, maxQuantity: 5,
    category: 'Oils & Ghee', badge: 'ORGANIC',
  },
]
const DEMO_SUMMARY: CartSummary = {
  subtotal: 1297, discount: 101, deliveryFee: 0, total: 1196, itemCount: 3,
}
// ─────────────────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n)
}

function OrderSummary({ items, summary }: { items: CartItem[]; summary: CartSummary }) {
  return (
    <aside className="hidden lg:block lg:sticky lg:top-8 self-start">
      <div className="rounded-3xl border border-[#bf8952]/25 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-[#bf8952]/15">
          <h2 className="font-display text-lg font-semibold text-[#1a0a0d]">Order Summary</h2>
        </div>
        <ul className="px-6 py-4 space-y-4 border-b border-[#bf8952]/15">
          {items.map(item => (
            <li key={item.id} className="flex gap-3">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#bf8952]/10">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#691626]
                                 text-[#FCFCF7] font-mono-price text-[10px] font-bold
                                 flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-[#1a0a0d] leading-snug line-clamp-2">{item.name}</p>
                <p className="font-mono-price text-sm font-bold text-[#691626] mt-1">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="px-6 py-4 space-y-2">
          <div className="flex justify-between text-sm font-body text-[#1a0a0d]/60">
            <span>Subtotal</span><span className="font-mono-price">{formatPrice(summary.subtotal)}</span>
          </div>
          {summary.discount > 0 && (
            <div className="flex justify-between text-sm font-body text-[#691626] font-semibold">
              <span>You save</span><span className="font-mono-price">−{formatPrice(summary.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-body text-[#1a0a0d]/60">
            <span>Delivery</span>
            <span className={`font-mono-price ${summary.deliveryFee === 0 ? 'text-[#691626] font-semibold' : ''}`}>
              {summary.deliveryFee === 0 ? 'FREE' : formatPrice(summary.deliveryFee)}
            </span>
          </div>
          <div className="border-t border-[#bf8952]/20 pt-3 flex justify-between">
            <span className="font-body font-bold text-base text-[#1a0a0d]">Total</span>
            <span className="font-mono-price text-xl font-bold text-[#691626]">{formatPrice(summary.total)}</span>
          </div>
        </div>
        <div className="px-6 pb-6 pt-2 flex items-center gap-2 border-t border-[#bf8952]/10">
          <ShieldCheck size={16} className="text-[#bf8952]" />
          <p className="font-body text-xs text-[#1a0a0d]/40">Secure 256-bit SSL checkout</p>
        </div>
      </div>
    </aside>
  )
}

export default function CheckoutPage() {
  const [step, setStep]             = useState<CheckoutStep>('address')
  const [address, setAddress]       = useState<Partial<Address>>({})
  const [payment, setPayment]       = useState<Partial<PaymentDetails>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Replace these two lines with useCart() once backend is connected:
  const items   = DEMO_ITEMS
  const summary = DEMO_SUMMARY

  function handleAddressNext(addr: Address) {
    setAddress(addr); setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handlePaymentNext(pay: PaymentDetails) {
    setPayment(pay); setStep('review')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handlePlaceOrder() {
    setIsProcessing(true)
    try {
      // ── WIRE UP HERE (Claude backend Prompt 3.8) ──────────────────────
      // const res = await fetch('/api/checkout', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ address, payment }),
      // })
      // const { razorpayOrderId, amount, key } = await res.json()
      // Open Razorpay SDK here, then on success:
      // router.push(`/order-confirmation?id=${orderId}`)
      await new Promise(r => setTimeout(r, 2000)) // remove this line when wiring
    } catch (err) {
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const STEP_TITLE: Record<CheckoutStep, string> = {
    address: 'Delivery Address',
    payment: 'Payment Method',
    review:  'Review Your Order',
  }

  return (
    <div className="min-h-screen bg-[#FCFCF7]">
      {/* Minimal header */}
      <header className="sticky top-0 z-30 bg-[#FCFCF7]/90 backdrop-blur-md border-b border-[#bf8952]/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4
                        flex items-center justify-between">
          <Link href="/shop"
            className="flex items-center gap-2 text-[#691626]/60 hover:text-[#691626] transition-colors">
            <ArrowLeft size={18} strokeWidth={2} />
            <span className="font-body text-sm font-medium hidden sm:block">Back to Shop</span>
          </Link>
          <Link href="/" className="font-display text-xl font-semibold text-[#691626]">
            Your Brand
          </Link>
          <div className="flex items-center gap-1.5 text-[#bf8952]">
            <ShieldCheck size={16} strokeWidth={2} />
            <span className="font-body text-xs text-[#1a0a0d]/40 hidden sm:block">Secure</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Step indicator */}
        <div className="mb-8 max-w-md mx-auto lg:max-w-none lg:mb-12">
          <StepIndicator currentStep={step} />
        </div>

        {/* Mobile: single col | Desktop: 2-col with sticky summary */}
        <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-12 xl:gap-16">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#1a0a0d] mb-6">
              {STEP_TITLE[step]}
            </h1>

            {step === 'address' && (
              <AddressStep defaultValues={address} onNext={handleAddressNext} />
            )}
            {step === 'payment' && (
              <PaymentStep onNext={handlePaymentNext} onBack={() => setStep('address')} />
            )}
            {step === 'review' && (
              <ReviewStep
                address={address as Address}
                payment={payment as PaymentDetails}
                items={items} summary={summary}
                onPlaceOrder={handlePlaceOrder}
                onBack={() => setStep('payment')}
                isProcessing={isProcessing}
              />
            )}
          </div>

          <OrderSummary items={items} summary={summary} />
        </div>

        {/* Mobile inline summary */}
        <div className="lg:hidden mt-8 rounded-2xl border border-[#bf8952]/25 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-[#bf8952]/15">
            <h3 className="font-body text-xs font-bold text-[#1a0a0d]/50 uppercase tracking-widest">
              Order Summary ({summary.itemCount} items)
            </h3>
          </div>
          <div className="px-4 py-4 space-y-2">
            <div className="flex justify-between text-sm font-body text-[#1a0a0d]/60">
              <span>Subtotal</span><span className="font-mono-price">{formatPrice(summary.subtotal)}</span>
            </div>
            {summary.discount > 0 && (
              <div className="flex justify-between text-sm font-body text-[#691626] font-semibold">
                <span>Savings</span><span className="font-mono-price">−{formatPrice(summary.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-body text-[#1a0a0d]/60">
              <span>Delivery</span>
              <span className="font-mono-price text-[#691626] font-semibold">
                {summary.deliveryFee === 0 ? 'FREE' : formatPrice(summary.deliveryFee)}
              </span>
            </div>
            <div className="border-t border-[#bf8952]/20 pt-2 flex justify-between">
              <span className="font-body font-bold text-[#1a0a0d]">Total</span>
              <span className="font-mono-price text-lg font-bold text-[#691626]">{formatPrice(summary.total)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}