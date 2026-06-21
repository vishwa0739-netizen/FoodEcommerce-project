'use client'

import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import type { AdminProduct } from '@/types/admin'
import { cn } from '@/lib/utils'

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

const STATUS_STYLES: Record<AdminProduct['status'], string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  out_of_stock: 'bg-red-50 text-red-700 border-red-200',
}
const STATUS_LABELS: Record<AdminProduct['status'], string> = {
  active: 'Active',
  draft: 'Draft',
  out_of_stock: 'Out of Stock',
}

interface ProductsTableProps {
  products: AdminProduct[]
  onEdit: (product: AdminProduct) => void
  onDelete: (id: string) => void
}

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps) {
  return (
    <div className="rounded-2xl border border-[#e7e1d4] bg-white overflow-hidden">
      {/* Desktop/tablet table — md (768px) and up */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f4f3ef] font-body text-xs font-semibold uppercase tracking-wide text-[#2b1418]/45">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e1d4]">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-[#f4f3ef]/60 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 flex-shrink-0 rounded-lg overflow-hidden bg-[#f4f3ef]">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="44px" />
                    </div>
                    <span className="font-body text-sm font-medium text-[#2b1418] line-clamp-1 max-w-[220px]">
                      {p.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-body text-sm text-[#2b1418]/60">{p.category}</td>
                <td className="px-5 py-3.5 font-mono-price text-sm font-semibold text-[#691626]">
                  {formatPrice(p.price)}
                </td>
                <td className="px-5 py-3.5 font-mono-price text-sm text-[#2b1418]">
                  {p.stock <= 5 ? (
                    <span className="text-red-600 font-semibold">{p.stock} left</span>
                  ) : (
                    p.stock
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full border px-2.5 py-1 font-body text-xs font-semibold',
                      STATUS_STYLES[p.status]
                    )}
                  >
                    {STATUS_LABELS[p.status]}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(p)}
                      aria-label={`Edit ${p.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#2b1418]/50 hover:bg-[#691626]/8 hover:text-[#691626] transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      aria-label={`Delete ${p.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#2b1418]/50 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list — below md (768px) */}
      <ul className="md:hidden divide-y divide-[#e7e1d4]">
        {products.map((p) => (
          <li key={p.id} className="flex gap-3 p-4">
            <div className="relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden bg-[#f4f3ef]">
              <Image src={p.image} alt={p.name} fill className="object-cover" sizes="56px" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-body text-sm font-semibold text-[#2b1418] line-clamp-1">{p.name}</p>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full border px-2 py-0.5 font-body text-[10px] font-semibold flex-shrink-0',
                    STATUS_STYLES[p.status]
                  )}
                >
                  {STATUS_LABELS[p.status]}
                </span>
              </div>
              <p className="font-body text-xs text-[#2b1418]/45 mt-0.5">{p.category}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="font-mono-price text-sm font-bold text-[#691626]">{formatPrice(p.price)}</span>
                <span className="font-mono-price text-xs text-[#2b1418]/50">{p.stock} in stock</span>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => onEdit(p)} className="font-body text-xs font-semibold text-[#691626]">
                  Edit
                </button>
                <button onClick={() => onDelete(p.id)} className="font-body text-xs font-semibold text-red-600">
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}