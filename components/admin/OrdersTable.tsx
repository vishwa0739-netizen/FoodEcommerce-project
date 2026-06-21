'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import type { AdminOrder, AdminOrderStatus } from '@/types/admin'
import { OrderStatusBadge } from './OrderStatusBadge'

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

const STATUS_OPTIONS: AdminOrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded',
]

interface OrdersTableProps {
  orders: AdminOrder[]
  onStatusChange: (id: string, status: AdminOrderStatus) => void
}

type SortKey = 'date' | 'total'

export function OrdersTable({ orders, onStatusChange }: OrdersTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const sorted = useMemo(() => {
    const copy = [...orders]
    copy.sort((a, b) => {
      const valA = sortKey === 'date' ? new Date(a.createdAt).getTime() : a.total
      const valB = sortKey === 'date' ? new Date(b.createdAt).getTime() : b.total
      return sortDir === 'asc' ? valA - valB : valB - valA
    })
    return copy
  }, [orders, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  function SortHeader({ label, sortk }: { label: string; sortk: SortKey }) {
    const active = sortKey === sortk
    return (
      <button onClick={() => toggleSort(sortk)} className="flex items-center gap-1 hover:text-[#691626] transition-colors">
        {label}
        {active && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </button>
    )
  }

  return (
    <div className="rounded-2xl border border-[#e7e1d4] bg-white overflow-hidden">
      {/* Desktop/tablet table — md (768px) and up */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f4f3ef] font-body text-xs font-semibold uppercase tracking-wide text-[#2b1418]/45">
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3"><SortHeader label="Date" sortk="date" /></th>
              <th className="px-5 py-3"><SortHeader label="Total" sortk="total" /></th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e1d4]">
            {sorted.map((order) => (
              <tr key={order.id} className="hover:bg-[#f4f3ef]/60 transition-colors">
                <td className="px-5 py-3.5 font-mono-price text-sm text-[#2b1418]">#{order.id}</td>
                <td className="px-5 py-3.5">
                  <p className="font-body text-sm font-medium text-[#2b1418]">{order.customerName}</p>
                  <p className="font-body text-xs text-[#2b1418]/40">{order.customerEmail}</p>
                </td>
                <td className="px-5 py-3.5 font-body text-sm text-[#2b1418]/60">{formatDate(order.createdAt)}</td>
                <td className="px-5 py-3.5 font-mono-price text-sm font-semibold text-[#691626]">
                  {formatPrice(order.total)}
                </td>
                <td className="px-5 py-3.5">
                  <select
                    value={order.status}
                    onChange={(e) => onStatusChange(order.id, e.target.value as AdminOrderStatus)}
                    className="rounded-lg border border-[#e7e1d4] bg-white px-2.5 py-1.5 font-body text-xs font-medium text-[#2b1418] focus:outline-none focus:ring-2 focus:ring-[#bf8952]/30"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s[0].toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards — below md (768px) */}
      <ul className="md:hidden divide-y divide-[#e7e1d4]">
        {sorted.map((order) => (
          <li key={order.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono-price text-sm font-semibold text-[#2b1418]">#{order.id}</span>
              <OrderStatusBadge status={order.status} />
            </div>
            <p className="font-body text-sm text-[#2b1418]">{order.customerName}</p>
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-[#2b1418]/45">{formatDate(order.createdAt)}</span>
              <span className="font-mono-price text-sm font-bold text-[#691626]">{formatPrice(order.total)}</span>
            </div>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value as AdminOrderStatus)}
              className="w-full mt-1 rounded-lg border border-[#e7e1d4] bg-white px-2.5 py-2 font-body text-xs font-medium text-[#2b1418]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s[0].toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </li>
        ))}
      </ul>
    </div>
  )
}