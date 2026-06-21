import type { Metadata, Viewport } from 'next'
import { fontVariables } from '../fonts'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Sign In — Suresh Foods',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#691626',
  width: 'device-width',
  initialScale: 1,
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontVariables} bg-background`}>
      <body className="font-body antialiased">
        <div className="min-h-screen w-full flex items-center justify-center px-16 py-32 relative overflow-hidden bg-gradient-to-br from-cream via-[#f5ece0] to-[#ede0cc]">
          <div
            aria-hidden="true"
            className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold/10 hidden sm:block"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-wine/[0.06] hidden sm:block"
          />
          <div className="relative z-10 w-full max-w-[420px]">{children}</div>
        </div>
      </body>
    </html>
  )
}