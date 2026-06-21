import { TrendingUp, TrendingDown, IndianRupee, ShoppingBag, PackageX, Users } from 'lucide-react'
import type { DashboardStat } from '@/types/admin'
import { cn } from '@/lib/utils'

const ICONS = {
  revenue: IndianRupee,
  orders: ShoppingBag,
  stock: PackageX,
  customers: Users,
}

export function StatCard({ stat }: { stat: DashboardStat }) {
  const Icon = ICONS[stat.icon]

  return (
    <div className="rounded-2xl border border-[#e7e1d4] bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bf8952]/12 text-[#691626]">
          <Icon size={20} strokeWidth={1.75} />
        </span>
        {stat.change && (
          <span
            className={cn(
              'flex items-center gap-1 font-mono-price text-xs font-semibold',
              stat.trend === 'up' ? 'text-emerald-600' : stat.trend === 'down' ? 'text-red-500' : 'text-[#2b1418]/40'
            )}
          >
            {stat.trend === 'up' && <TrendingUp size={12} />}
            {stat.trend === 'down' && <TrendingDown size={12} />}
            {stat.change}
          </span>
        )}
      </div>
      <p className="mt-4 font-mono-price text-2xl font-bold text-[#2b1418]">{stat.value}</p>
      <p className="mt-1 font-body text-sm text-[#2b1418]/50">{stat.label}</p>
    </div>
  )
}