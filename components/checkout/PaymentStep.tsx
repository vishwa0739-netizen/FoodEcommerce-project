'use client'

import { useState } from 'react'
import { CreditCard, Smartphone, Building2, Wallet, ChevronRight, Lock } from 'lucide-react'
import type { PaymentDetails, PaymentMethod } from '@/types/cart'

interface PaymentStepProps {
  onNext: (payment: PaymentDetails) => void
  onBack: () => void
}

const METHODS: { id: PaymentMethod; label: string; desc: string; icon: React.ReactNode }[] = [
  { id: 'upi',        label: 'UPI',                desc: 'GPay, PhonePe, Paytm & more', icon: <Smartphone size={22} strokeWidth={1.5} /> },
  { id: 'card',       label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay',     icon: <CreditCard  size={22} strokeWidth={1.5} /> },
  { id: 'netbanking', label: 'Net Banking',          desc: 'All major Indian banks',       icon: <Building2   size={22} strokeWidth={1.5} /> },
  { id: 'wallet',     label: 'Wallets',              desc: 'Paytm, Amazon Pay, Mobikwik', icon: <Wallet      size={22} strokeWidth={1.5} /> },
]

const BANKS   = ['SBI','HDFC Bank','ICICI Bank','Axis Bank','Kotak Bank','PNB','Bank of Baroda','Canara Bank']
const WALLETS = ['Paytm','Amazon Pay','PhonePe','Mobikwik','Freecharge']

const inputCls = `
  w-full px-4 py-3.5 rounded-xl border
  font-body text-sm text-[#1a0a0d] placeholder:text-[#1a0a0d]/30
  bg-white border-[#bf8952]/30
  focus:outline-none focus:ring-2 focus:ring-[#691626]/20 focus:border-[#691626]
  transition-colors
`

function PayBtn({ disabled }: { disabled?: boolean }) {
  return (
    <button type="submit" disabled={disabled}
      className="w-full py-4 bg-[#691626] text-[#FCFCF7] font-body font-bold text-base
                 rounded-2xl hover:bg-[#7d1b2e] active:scale-[0.98] transition-all
                 shadow-lg shadow-[#691626]/25 flex items-center justify-center gap-2
                 disabled:opacity-40 disabled:cursor-not-allowed">
      <Lock size={16} strokeWidth={2.5} /> Pay Securely
    </button>
  )
}

function UPIForm({ onSubmit }: { onSubmit: (vpa: string) => void }) {
  const [vpa, setVpa] = useState('')
  const [error, setError] = useState('')
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!vpa.match(/^[\w.\-_]+@[\w]+$/)) { setError('Enter a valid UPI ID'); return }
    onSubmit(vpa)
  }
  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="upi" className="font-body text-sm font-semibold text-[#1a0a0d]/70">
          UPI ID <span className="text-[#691626]">*</span>
        </label>
        <input id="upi" type="text" inputMode="email" placeholder="yourname@upi"
          value={vpa} onChange={e => { setVpa(e.target.value); setError('') }}
          className={inputCls} />
        {error && <p className="font-body text-xs text-red-600">{error}</p>}
      </div>
      <div className="flex gap-2 flex-wrap">
        {['GPay','PhonePe','Paytm','BHIM'].map(app => (
          <span key={app}
            className="px-3 py-1.5 rounded-lg border border-[#bf8952]/30
                       font-body text-xs text-[#691626]">
            {app}
          </span>
        ))}
      </div>
      <PayBtn />
    </form>
  )
}

function CardForm({ onSubmit }: { onSubmit: (d: { number: string; expiry: string; cvv: string; holderName: string }) => void }) {
  const [form, setForm] = useState({ number: '', expiry: '', cvv: '', holderName: '' })
  const [errors, setErrors] = useState({ number: '', expiry: '', cvv: '', holderName: '' })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const raw = form.number.replace(/\s/g, '')
    const err = { number: '', expiry: '', cvv: '', holderName: '' }
    if (raw.length < 16)                       err.number     = 'Enter 16-digit card number'
    if (!form.expiry.match(/^\d{2}\/\d{2}$/))  err.expiry     = 'Enter MM/YY'
    if (form.cvv.length < 3)                   err.cvv        = 'Enter 3-digit CVV'
    if (!form.holderName.trim())               err.holderName = 'Enter name as on card'
    setErrors(err)
    if (Object.values(err).some(Boolean)) return
    onSubmit({ ...form, number: raw })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="cardNum" className="font-body text-sm font-semibold text-[#1a0a0d]/70">Card Number *</label>
        <input id="cardNum" type="text" inputMode="numeric"
          placeholder="1234 5678 9012 3456" value={form.number}
          onChange={e => setForm(f => ({ ...f, number: e.target.value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim() }))}
          className={inputCls} />
        {errors.number && <p className="font-body text-xs text-red-600">{errors.number}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="expiry" className="font-body text-sm font-semibold text-[#1a0a0d]/70">Expiry *</label>
          <input id="expiry" type="text" inputMode="numeric" placeholder="MM/YY"
            value={form.expiry}
            onChange={e => setForm(f => ({ ...f, expiry: e.target.value.replace(/\D/g,'').slice(0,4).replace(/^(\d{2})(\d)/,'$1/$2') }))}
            className={inputCls} />
          {errors.expiry && <p className="font-body text-xs text-red-600">{errors.expiry}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cvv" className="font-body text-sm font-semibold text-[#1a0a0d]/70">CVV *</label>
          <input id="cvv" type="password" inputMode="numeric" placeholder="•••" maxLength={4}
            value={form.cvv}
            onChange={e => setForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g,'').slice(0,4) }))}
            className={inputCls} />
          {errors.cvv && <p className="font-body text-xs text-red-600">{errors.cvv}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="holderName" className="font-body text-sm font-semibold text-[#1a0a0d]/70">Name on Card *</label>
        <input id="holderName" type="text" autoComplete="cc-name"
          placeholder="PRIYA SHARMA" value={form.holderName}
          onChange={e => setForm(f => ({ ...f, holderName: e.target.value.toUpperCase() }))}
          className={inputCls} />
        {errors.holderName && <p className="font-body text-xs text-red-600">{errors.holderName}</p>}
      </div>
      <PayBtn />
    </form>
  )
}

function NetbankingForm({ onSubmit }: { onSubmit: (bank: string) => void }) {
  const [selected, setSelected] = useState('')
  return (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {BANKS.map(bank => (
          <button key={bank} type="button" onClick={() => setSelected(bank)}
            className={`px-3 py-3 rounded-xl border text-left font-body text-sm transition-all
              ${selected === bank
                ? 'border-[#691626] bg-[#691626]/5 text-[#691626] font-semibold'
                : 'border-[#bf8952]/30 text-[#1a0a0d]/70 hover:border-[#691626]/40'}`}>
            {bank}
          </button>
        ))}
      </div>
      <button onClick={() => selected && onSubmit(selected)} disabled={!selected}
        className="w-full py-4 bg-[#691626] text-[#FCFCF7] font-body font-bold text-base
                   rounded-2xl hover:bg-[#7d1b2e] active:scale-[0.98] transition-all
                   shadow-lg shadow-[#691626]/25 flex items-center justify-center gap-2
                   disabled:opacity-40 disabled:cursor-not-allowed">
        <Lock size={16} strokeWidth={2.5} /> Pay Securely
      </button>
    </div>
  )
}

function WalletForm({ onSubmit }: { onSubmit: (w: string) => void }) {
  const [selected, setSelected] = useState('')
  return (
    <div className="mt-4 space-y-3">
      {WALLETS.map(wallet => (
        <button key={wallet} type="button" onClick={() => setSelected(wallet)}
          className={`w-full px-4 py-3.5 rounded-xl border text-left font-body text-sm
                      transition-all flex items-center justify-between
            ${selected === wallet
              ? 'border-[#691626] bg-[#691626]/5 text-[#691626] font-semibold'
              : 'border-[#bf8952]/30 text-[#1a0a0d]/70 hover:border-[#691626]/40'}`}>
          {wallet}
          {selected === wallet && (
            <div className="w-4 h-4 rounded-full bg-[#691626] flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          )}
        </button>
      ))}
      <button onClick={() => selected && onSubmit(selected)} disabled={!selected}
        className="w-full py-4 bg-[#691626] text-[#FCFCF7] font-body font-bold text-base
                   rounded-2xl hover:bg-[#7d1b2e] active:scale-[0.98] transition-all
                   shadow-lg shadow-[#691626]/25 flex items-center justify-center gap-2
                   disabled:opacity-40 disabled:cursor-not-allowed">
        <Lock size={16} strokeWidth={2.5} /> Pay Securely
      </button>
    </div>
  )
}

export function PaymentStep({ onNext, onBack }: PaymentStepProps) {
  const [selected, setSelected] = useState<PaymentMethod | null>(null)

  return (
    <div className="space-y-4">
      {/* Security badge */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl
                      bg-[#bf8952]/10 border border-[#bf8952]/30">
        <Lock size={14} className="text-[#bf8952]" />
        <p className="font-body text-xs text-[#691626]">
          All payments secured with 256-bit SSL encryption
        </p>
      </div>

      {/* Method accordion */}
      <div className="flex flex-col gap-2">
        {METHODS.map(m => (
          <div key={m.id}>
            <button type="button"
              onClick={() => setSelected(selected === m.id ? null : m.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all
                ${selected === m.id
                  ? 'border-[#691626] bg-[#691626]/5'
                  : 'border-[#bf8952]/30 bg-white hover:border-[#691626]/40'}`}>
              <span className={selected === m.id ? 'text-[#691626]' : 'text-[#1a0a0d]/40'}>
                {m.icon}
              </span>
              <div className="flex-1 text-left">
                <p className={`font-body text-sm font-semibold
                  ${selected === m.id ? 'text-[#691626]' : 'text-[#1a0a0d]'}`}>
                  {m.label}
                </p>
                <p className="font-body text-xs text-[#1a0a0d]/40 mt-0.5">{m.desc}</p>
              </div>
              <ChevronRight size={16}
                className={`transition-transform ${selected === m.id ? 'rotate-90 text-[#691626]' : 'text-[#1a0a0d]/30'}`} />
            </button>

            {selected === m.id && (
              <div className="mt-1 px-2 animate-fadeIn">
                {m.id === 'upi'        && <UPIForm        onSubmit={vpa  => onNext({ method: 'upi',        upi:        { vpa } })} />}
                {m.id === 'card'       && <CardForm       onSubmit={d    => onNext({ method: 'card',       card:       d })} />}
                {m.id === 'netbanking' && <NetbankingForm  onSubmit={bank => onNext({ method: 'netbanking', netbanking: { bank } })} />}
                {m.id === 'wallet'     && <WalletForm     onSubmit={p    => onNext({ method: 'wallet',     wallet:     { provider: p } })} />}
              </div>
            )}
          </div>
        ))}
      </div>

      <button type="button" onClick={onBack}
        className="w-full py-3 text-[#691626]/60 font-body text-sm
                   hover:text-[#691626] transition-colors">
        ← Back to Address
      </button>
    </div>
  )
}