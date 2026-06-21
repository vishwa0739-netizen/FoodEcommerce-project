'use client'

import { useState } from 'react'
import type { AdminOrder, AdminOrderStatus } from '@/types/admin'
import { OrdersTable } from '@/components/admin/OrdersTable'

const DEMO_ORDERS: AdminOrder[] = [
  { id: '10231', customerName: 'Priya Sharma', customerEmail: 'priya@example.com', items: [], total: 1196, status: 'processing', paymentMethod: 'UPI', createdAt: '2026-06-20' },
  { id: '10230', customerName: 'Rahul Verma', customerEmail: 'rahul@example.com', items: [], total: 899, status: 'delivered', paymentMethod: 'Card', createdAt: '2026-06-19' },
  { id: '10229', customerName: 'Anita Desai', customerEmail: 'anita@example.com', items: [], total: 2450, status: 'shipped', paymentMethod: 'UPI', createdAt: '2026-06-19' },
  { id: '10228', customerName: 'Vikram Rao', customerEmail: 'vikram@example.com', items: [], total: 599, status: 'pending', paymentMethod: 'Wallet', createdAt: '2026-06-18' },
  { id: '10227', customerName: 'Sneha Iyer', customerEmail: 'sneha@example.com', items: [], total: 1750, status: 'cancelled', paymentMethod: 'Card', createdAt: '2026-06-17' },
]

const FILTERS: { label: string; value: AdminOrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(DEMO_ORDERS)
  const [filter, setFilter] = useState<AdminOrderStatus | 'all'>('all')

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  function handleStatusChange(id: string, status: AdminOrderStatus) {
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#2b1418]">Orders</h1>
        <p className="font-body text-sm text-[#2b1418]/50 mt-1">{orders.length} orders total</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 rounded-full border px-3.5 py-1.5 font-body text-xs font-semibold transition-colors
              ${
                filter === f.value
                  ? 'border-[#691626] bg-[#691626] text-[#FCFCF7]'
                  : 'border-[#e7e1d4] text-[#2b1418]/55 hover:border-[#bf8952]'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <OrdersTable orders={filtered} onStatusChange={handleStatusChange} />
    </div>
  )
}