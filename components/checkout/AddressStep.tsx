'use client'

import { useState } from 'react'
import type { Address } from '@/types/cart'

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh',
  'Dadra & Nagar Haveli & Daman & Diu',
  'Delhi','Jammu & Kashmir','Ladakh','Lakshadweep','Puducherry',
]

interface AddressStepProps {
  defaultValues?: Partial<Address>
  onNext: (address: Address) => void
}

const inputCls = `
  w-full px-4 py-3.5 rounded-xl border
  font-body text-sm text-[#1a0a0d] placeholder:text-[#1a0a0d]/30
  bg-white border-[#bf8952]/30
  focus:outline-none focus:ring-2 focus:ring-[#691626]/20 focus:border-[#691626]
  transition-colors
`

function Field({ label, id, required, error, children }: {
  label: string; id: string; required?: boolean; error?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-body text-sm font-semibold text-[#1a0a0d]/70">
        {label}{required && <span className="text-[#691626] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="font-body text-xs text-red-600">{error}</p>}
    </div>
  )
}

export function AddressStep({ defaultValues = {}, onNext }: AddressStepProps) {
  const [form, setForm] = useState<Partial<Address>>({
    fullName: '', phone: '', addressLine1: '',
    addressLine2: '', landmark: '', city: '', state: '', pincode: '',
    ...defaultValues,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({})

  function set(field: keyof Address, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e: typeof errors = {}
    if (!form.fullName?.trim())              e.fullName     = 'Name is required'
    if (!form.phone?.match(/^[6-9]\d{9}$/)) e.phone        = 'Enter valid 10-digit mobile'
    if (!form.addressLine1?.trim())          e.addressLine1 = 'Address is required'
    if (!form.city?.trim())                  e.city         = 'City is required'
    if (!form.state)                         e.state        = 'Please select a state'
    if (!form.pincode?.match(/^\d{6}$/))     e.pincode      = 'Enter valid 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) onNext(form as Address)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" id="fullName" required error={errors.fullName}>
          <input id="fullName" type="text" autoComplete="name"
            placeholder="Priya Sharma" value={form.fullName}
            onChange={e => set('fullName', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Mobile Number" id="phone" required error={errors.phone}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono-price text-sm text-[#1a0a0d]/40">+91</span>
            <input id="phone" type="tel" autoComplete="tel"
              placeholder="98765 43210" maxLength={10} value={form.phone}
              onChange={e => set('phone', e.target.value.replace(/\D/g, ''))}
              className={`${inputCls} pl-12`} />
          </div>
        </Field>
      </div>

      <Field label="Address Line 1" id="addressLine1" required error={errors.addressLine1}>
        <input id="addressLine1" type="text" autoComplete="address-line1"
          placeholder="Flat / House No., Building, Street" value={form.addressLine1}
          onChange={e => set('addressLine1', e.target.value)} className={inputCls} />
      </Field>

      <Field label="Address Line 2" id="addressLine2">
        <input id="addressLine2" type="text" autoComplete="address-line2"
          placeholder="Area, Colony (Optional)" value={form.addressLine2}
          onChange={e => set('addressLine2', e.target.value)} className={inputCls} />
      </Field>

      <Field label="Landmark" id="landmark">
        <input id="landmark" type="text"
          placeholder="Near temple, opposite mall... (Optional)" value={form.landmark}
          onChange={e => set('landmark', e.target.value)} className={inputCls} />
      </Field>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Field label="City" id="city" required error={errors.city}>
          <input id="city" type="text" autoComplete="address-level2"
            placeholder="Chennai" value={form.city}
            onChange={e => set('city', e.target.value)} className={inputCls} />
        </Field>
        <Field label="Pincode" id="pincode" required error={errors.pincode}>
          <input id="pincode" type="text" inputMode="numeric"
            placeholder="600001" maxLength={6} value={form.pincode}
            onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))}
            className={inputCls} />
        </Field>
        <Field label="State" id="state" required error={errors.state}>
          <select id="state" value={form.state}
            onChange={e => set('state', e.target.value)}
            className={`${inputCls} appearance-none`}>
            <option value="">Select state</option>
            {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <button type="submit"
        className="w-full py-4 mt-2 bg-[#691626] text-[#FCFCF7]
                   font-body font-bold text-base rounded-2xl
                   hover:bg-[#7d1b2e] active:scale-[0.98] transition-all
                   shadow-lg shadow-[#691626]/25">
        Continue to Payment
      </button>
    </form>
  )
}