import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { AdminOrder } from '@/types/admin'
import { OrderStatusBadge } from './OrderStatusBadge'

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

export function RecentOrdersTable({ orders }: { orders: AdminOrder[] }) {
  return (
    <div className="rounded-2xl border border-[#e7e1d4] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#e7e1d4]">
        <h3 className="font-display text-base font-semibold text-[#2b1418]">Recent Orders</h3>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 font-body text-xs font-semibold text-[#691626] hover:underline"
        >
          View all <ArrowUpRight size={12} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f4f3ef] font-body text-xs font-semibold uppercase tracking-wide text-[#2b1418]/45">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e7e1d4]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#f4f3ef]/60 transition-colors">
                <td className="px-5 py-3.5 font-mono-price text-sm text-[#2b1418]">#{order.id}</td>
                <td className="px-5 py-3.5 font-body text-sm text-[#2b1418]">{order.customerName}</td>
                <td className="px-5 py-3.5 font-mono-price text-sm font-semibold text-[#691626]">
                  {formatPrice(order.total)}
                </td>
                <td className="px-5 py-3.5">
                  <OrderStatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}