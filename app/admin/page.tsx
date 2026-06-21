import { StatCard } from '@/components/admin/StatCard'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { RecentOrdersTable } from '@/components/admin/RecentOrdersTable'
import type { DashboardStat, RevenueDataPoint, AdminOrder } from '@/types/admin'

const STATS: DashboardStat[] = [
  { label: "Today's Revenue", value: '₹24,650', change: '+12.4%', trend: 'up', icon: 'revenue' },
  { label: 'Orders Today', value: '38', change: '+5', trend: 'up', icon: 'orders' },
  { label: 'Low Stock Items', value: '6', change: '+2', trend: 'down', icon: 'stock' },
  { label: 'New Customers', value: '14', change: '+3', trend: 'up', icon: 'customers' },
]

const REVENUE_DATA: RevenueDataPoint[] = [
  { date: 'Jun 7', revenue: 12400 },
  { date: 'Jun 8', revenue: 15200 },
  { date: 'Jun 9', revenue: 11800 },
  { date: 'Jun 10', revenue: 18900 },
  { date: 'Jun 11', revenue: 16500 },
  { date: 'Jun 12', revenue: 21300 },
  { date: 'Jun 13', revenue: 19700 },
  { date: 'Jun 14', revenue: 23100 },
  { date: 'Jun 15', revenue: 20400 },
  { date: 'Jun 16', revenue: 24800 },
  { date: 'Jun 17', revenue: 22900 },
  { date: 'Jun 18', revenue: 26200 },
  { date: 'Jun 19', revenue: 25100 },
  { date: 'Jun 20', revenue: 24650 },
]

const RECENT_ORDERS: AdminOrder[] = [
  { id: '10231', customerName: 'Priya Sharma', customerEmail: '', items: [], total: 1196, status: 'processing', paymentMethod: 'UPI', createdAt: '2026-06-20' },
  { id: '10230', customerName: 'Rahul Verma', customerEmail: '', items: [], total: 899, status: 'delivered', paymentMethod: 'Card', createdAt: '2026-06-19' },
  { id: '10229', customerName: 'Anita Desai', customerEmail: '', items: [], total: 2450, status: 'shipped', paymentMethod: 'UPI', createdAt: '2026-06-19' },
  { id: '10228', customerName: 'Vikram Rao', customerEmail: '', items: [], total: 599, status: 'pending', paymentMethod: 'Wallet', createdAt: '2026-06-18' },
]

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-[#2b1418]">Dashboard</h1>
        <p className="font-body text-sm text-[#2b1418]/50 mt-1">
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* 1 col mobile, 2 col tablet (md, 768px+), 4 col desktop (lg, 1024px+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <RevenueChart data={REVENUE_DATA} />

      <RecentOrdersTable orders={RECENT_ORDERS} />
    </div>
  )
}