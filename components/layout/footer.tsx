'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { footerSections } from '@/lib/navigation'
import { cn } from '@/lib/utils'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800'

type IconProps = { className?: string }

function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  )
}

function XIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.66l7.73-8.83L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
    </svg>
  )
}

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/web.exx/', icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com', icon: FacebookIcon },
  { label: 'X (Twitter)', href: 'https://x.com', icon: XIcon },
]

export function Footer() {
  return (
    <footer className="bg-brand-900 text-background/90">
      {/* Main footer */}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 md:grid-cols-4 md:gap-6">
          {/* Brand */}
          <div className="md:pr-6">
            <span className="font-display text-2xl font-semibold text-background">
              Suresh <span className="text-accent"> Foods.</span>
            </span>
            <p className="mt-4 text-sm leading-relaxed text-background/70">
              Premium artisan food and gourmet provisions — sourced from named
              producers, delivered with care.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full border border-background/15 text-background/80 transition-colors hover:border-accent hover:text-accent',
                      focusRing,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link sections — accordion on mobile, columns on desktop */}
          {footerSections.map((section) => (
            <FooterSection key={section.title} title={section.title}>
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      'inline-block rounded py-1 text-sm text-background/70 transition-colors hover:text-accent',
                      focusRing,
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </FooterSection>
          ))}
        </div>

        {/* Legal */}
        <div className="mt-12 border-t border-background/10 pt-6">
          <p className="text-xs text-background/60">
            © {new Date().getFullYear()} Suresh Foods. All rights reserved.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
            <Link
              href="/legal/privacy"
              className={cn('text-accent transition-colors hover:text-accent-300', focusRing)}
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/terms"
              className={cn('text-accent transition-colors hover:text-accent-300', focusRing)}
            >
              Terms of Service
            </Link>
            <Link
              href="/legal/cookies"
              className={cn('text-accent transition-colors hover:text-accent-300', focusRing)}
            >
              Cookie Policy
            </Link>
          </div>
          <p className="mt-3 font-mono-price text-xs uppercase tracking-wider text-background/50">
            FSSAI : 10012345000123
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-background/10 md:border-none">
      {/* Mobile accordion trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center justify-between py-4 md:pointer-events-none md:py-0',
          focusRing,
        )}
      >
        <span className="font-mono-price text-xs uppercase tracking-wider text-accent">
          {title}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-background/60 transition-transform md:hidden',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>
      <ul
        className={cn(
          'flex-col gap-1 pb-4 md:mt-4 md:flex md:pb-0',
          open ? 'flex' : 'hidden md:flex',
        )}
      >
        {children}
      </ul>
    </div>
  )
}
