'use client'

import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import type { AdminProduct } from '@/types/admin'
import type { DietaryTag } from '@/types/cart'

const CATEGORIES = [
  'Pickles & Preserves',
  'Oils & Ghee',
  'Spices & Masalas',
  'Sweets & Snacks',
  'Beverages',
  'Dry Fruits & Nuts',
]

const DIETARY_TAGS: DietaryTag[] = [
  'Vegan', 'Gluten-Free', 'Organic', 'Sugar-Free', 'Dairy-Free', 'Nut-Free', 'Halal', 'Jain',
]

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Omit<AdminProduct, 'id' | 'createdAt'>) => void
  initialValues?: AdminProduct
}

const inputCls = `
  w-full px-4 py-2.5 rounded-xl border border-[#e7e1d4] bg-white
  font-body text-sm text-[#2b1418] placeholder:text-[#2b1418]/30
  focus:outline-none focus:ring-2 focus:ring-[#bf8952]/30 focus:border-[#bf8952]
  transition-colors
`

export function AddProductModal({ isOpen, onClose, onSave, initialValues }: AddProductModalProps) {
  const [form, setForm] = useState({
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
    price: initialValues?.price?.toString() ?? '',
    category: initialValues?.category ?? CATEGORIES[0],
    stock: initialValues?.stock?.toString() ?? '',
  })
  const [dietaryTags, setDietaryTags] = useState<DietaryTag[]>(initialValues?.dietaryTags ?? [])
  const [imagePreview, setImagePreview] = useState(initialValues?.image ?? '')

  if (!isOpen) return null

  function toggleTag(tag: DietaryTag) {
    setDietaryTags((tags) => (tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]))
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    // In production: upload to Supabase Storage here, then setImagePreview(publicUrl)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      status: Number(form.stock) > 0 ? 'active' : 'out_of_stock',
      image: imagePreview || '/placeholder-product.jpg',
      dietaryTags,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div onClick={onClose} aria-hidden className="fixed inset-0 bg-black/50" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={initialValues ? 'Edit product' : 'Add product'}
        className="relative z-10 w-full sm:max-w-lg max-h-[92vh] sm:max-h-[88vh] overflow-y-auto
                   rounded-t-3xl sm:rounded-3xl bg-white"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 border-b border-[#e7e1d4]">
          <h2 className="font-display text-lg font-semibold text-[#2b1418]">
            {initialValues ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f4f3ef] text-[#2b1418]/50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Image upload */}
          <div>
            <label className="font-body text-sm font-semibold text-[#2b1418]/70 block mb-1.5">
              Product Image
            </label>
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-[#e7e1d4]
                         bg-[#f4f3ef] cursor-pointer hover:border-[#bf8952] transition-colors overflow-hidden relative"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-[#2b1418]/40">
                  <Upload size={20} />
                  <span className="font-body text-xs">Click to upload</span>
                </div>
              )}
              <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          <div>
            <label htmlFor="name" className="font-body text-sm font-semibold text-[#2b1418]/70 block mb-1.5">
              Product Name *
            </label>
            <input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Artisan Mango Pickle"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="description" className="font-body text-sm font-semibold text-[#2b1418]/70 block mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Traditional Andhra-style pickle, sun-ripened mangoes…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="font-body text-sm font-semibold text-[#2b1418]/70 block mb-1.5">
                Price (₹) *
              </label>
              <input
                id="price"
                required
                type="number"
                min="0"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="349"
                className={inputCls}
              />
            </div>
            <div>
              <label htmlFor="stock" className="font-body text-sm font-semibold text-[#2b1418]/70 block mb-1.5">
                Stock Qty *
              </label>
              <input
                id="stock"
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                placeholder="50"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="font-body text-sm font-semibold text-[#2b1418]/70 block mb-1.5">
              Category *
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={`${inputCls} appearance-none`}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-body text-sm font-semibold text-[#2b1418]/70 block mb-1.5">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full border font-body text-xs font-medium transition-colors
                    ${
                      dietaryTags.includes(tag)
                        ? 'border-[#691626] bg-[#691626]/8 text-[#691626]'
                        : 'border-[#e7e1d4] text-[#2b1418]/50 hover:border-[#bf8952]'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#e7e1d4] font-body text-sm font-semibold text-[#2b1418]/60
                         hover:bg-[#f4f3ef] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#691626] font-body text-sm font-semibold text-[#FCFCF7]
                         hover:bg-[#7d1b2e] transition-colors"
            >
              {initialValues ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}