import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { BottomTabBar } from '@/components/layout/bottom-tab-bar'
import { CartProvider } from '@/components/cart/CartContext'
import { CartDrawer } from '@/components/cart/CartDrawer'
import './globals.css'

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
  title: 'Suresh Foods — Premium Artisan Food & Gourmet Provisions',
  description:
    'Premium artisan food and gourmet provisions — sourced from named producers, delivered with care.',
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Suresh Foods',
    statusBarStyle: 'default',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#691626',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${dmMono.variable} bg-background`}
    >
      <body className="font-body antialiased">
        <CartProvider>
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <main className="flex-1 pb-20 md:pb-0">{children}</main>
            <Footer />
          </div>
          <BottomTabBar />
          <CartDrawer />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}