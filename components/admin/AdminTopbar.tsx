'use client'

import { Menu, Search, Bell, ChevronDown } from 'lucide-react'

interface AdminTopbarProps {
  onMenuClick: () => void
}

export function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-[#e7e1d4] bg-white px-4 py-3 sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="lg:hidden text-[#2b1418]/60 hover:text-[#691626] transition-colors"
      >
        <Menu size={22} />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2b1418]/30" />
        <input
          type="search"
          placeholder="Search orders, products, customers…"
          className="w-full rounded-full border border-[#e7e1d4] bg-[#f4f3ef] pl-9 pr-4 py-2 font-body text-sm text-[#2b1418]
                     placeholder:text-[#2b1418]/35 focus:outline-none focus:ring-2 focus:ring-[#bf8952]/40 focus:border-[#bf8952]
                     transition-colors"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#2b1418]/50
                     hover:bg-[#f4f3ef] hover:text-[#691626] transition-colors"
        >
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#691626]" />
        </button>

        <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-[#f4f3ef] transition-colors">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#691626] font-display text-sm font-semibold text-[#FCFCF7]">
            SF
          </div>
          <span className="hidden sm:block font-body text-sm font-medium text-[#2b1418]">Admin</span>
          <ChevronDown size={14} className="hidden sm:block text-[#2b1418]/40" />
        </button>
      </div>
    </header>
  )
}