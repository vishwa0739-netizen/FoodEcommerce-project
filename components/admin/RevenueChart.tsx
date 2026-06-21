'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { RevenueDataPoint } from '@/types/admin'

function formatINR(n: number) {
  return `₹${(n / 1000).toFixed(0)}k`
}

export function RevenueChart({ data }: { data: RevenueDataPoint[] }) {
  return (
    <div className="rounded-2xl border border-[#e7e1d4] bg-white p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="font-display text-base font-semibold text-[#2b1418]">Revenue</h3>
        <p className="font-body text-xs text-[#2b1418]/45">Last 14 days</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e1d4" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b5d52' }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={formatINR}
              tick={{ fontSize: 11, fill: '#6b5d52' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
  contentStyle={{
    borderRadius: 12,
    border: '1px solid #e7e1d4',
    fontSize: 12,
    fontFamily: 'var(--font-body)',
  }}
/>
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#691626"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#bf8952' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}