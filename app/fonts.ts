import { Fraunces, Plus_Jakarta_Sans, DM_Mono } from 'next/font/google'

export const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  display: 'swap',
})

export const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
})

export const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
})

export const fontVariables = `${fraunces.variable} ${jakarta.variable} ${dmMono.variable}`