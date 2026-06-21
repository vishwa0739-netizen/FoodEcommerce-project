'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import type { AdminProduct } from '@/types/admin'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { AddProductModal } from '@/components/admin/AddProductModal'

const DEMO_PRODUCTS: AdminProduct[] = [
  {
    id: 'p1', name: 'Artisan Mango Pickle — Andhra Style', description: '',
    price: 349, category: 'Pickles & Preserves', stock: 42, status: 'active',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200',
    dietaryTags: ['Vegan'], createdAt: '2026-05-01',
  },
  {
    id: 'p2', name: 'Cold-Pressed Coconut Oil — 1L', description: '',
    price: 599, category: 'Oils & Ghee', stock: 4, status: 'active',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200',
    dietaryTags: ['Organic', 'Vegan'], createdAt: '2026-05-03',
  },
  {
    id: 'p3', name: 'Kashmiri Saffron — 2g Tin', description: '',
    price: 899, category: 'Spices & Masalas', stock: 0, status: 'out_of_stock',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200',
    dietaryTags: [], createdAt: '2026-04-28',
  },
  {
    id: 'p4', name: 'Organic A2 Cow Ghee — 500ml', description: '',
    price: 749, category: 'Oils & Ghee', stock: 18, status: 'active',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200',
    dietaryTags: ['Organic'], createdAt: '2026-04-20',
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(DEMO_PRODUCTS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<AdminProduct | undefined>(undefined)
  const [query, setQuery] = useState('')

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))

  function handleSave(data: Omit<AdminProduct, 'id' | 'createdAt'>) {
    if (editing) {
      setProducts((ps) => ps.map((p) => (p.id === editing.id ? { ...p, ...data } : p)))
    } else {
      setProducts((ps) => [{ ...data, id: `p${Date.now()}`, createdAt: new Date().toISOString() }, ...ps])
    }
    setEditing(undefined)
  }

  function handleDelete(id: string) {
    setProducts((ps) => ps.filter((p) => p.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#2b1418]">Products</h1>
          <p className="font-body text-sm text-[#2b1418]/50 mt-1">{products.length} products total</p>
        </div>
        <button
          onClick={() => {
            setEditing(undefined)
            setModalOpen(true)
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#691626] px-4 py-2.5 font-body text-sm font-semibold text-[#FCFCF7] hover:bg-[#7d1b2e] transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b1418]/30" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-xl border border-[#e7e1d4] bg-white pl-9 pr-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#bf8952]/30 focus:border-[#bf8952]"
        />
      </div>

      <ProductsTable
        products={filtered}
        onEdit={(p) => {
          setEditing(p)
          setModalOpen(true)
        }}
        onDelete={handleDelete}
      />

      <AddProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditing(undefined)
        }}
        onSave={handleSave}
        initialValues={editing}
      />
    </div>
  )
}