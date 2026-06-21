'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { adminNav } from '@/lib/admin-nav'
import { cn } from '@/lib/utils'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop — mobile/tablet only, shown when drawer is open */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/*
        Below lg (1024px): drawer, hidden by default, slides in via translate-x
        At lg+ : always visible, fixed in place
      */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#691626] transition-transform duration-300 ease-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <Link href="/admin" className="flex flex-col leading-none">
            <span className="font-mono-price text-[10px] uppercase tracking-[0.25em] text-[#bf8952]">
              Admin Panel
            </span>
            <span className="mt-1 font-display text-xl font-semibold text-[#FCFCF7]">
              Suresh <span className="text-[#bf8952]">Foods</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden text-[#FCFCF7]/60 hover:text-[#FCFCF7] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#bf8952] text-[#2b1418] font-semibold'
                    : 'text-[#FCFCF7]/70 hover:bg-white/10 hover:text-[#FCFCF7]'
                )}
              >
                <Icon size={18} strokeWidth={1.75} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="font-body text-xs text-[#FCFCF7]/40">v1.0 · Admin Panel</p>
        </div>
      </aside>
    </>
  )
}