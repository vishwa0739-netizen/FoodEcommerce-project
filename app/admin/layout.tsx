import type { Metadata, Viewport } from 'next'
import { Fraunces, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google'
import { AdminShell } from '@/components/admin/AdminShell'
import '../globals.css'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
})

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Admin Dashboard — Suresh Foods',
  description: 'Manage products, orders, and customers.',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#691626',
  width: 'device-width',
  initialScale: 1,
}

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${dmMono.variable} bg-background`}
    >
      <body className="font-body antialiased">
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  )
}