import type { Metadata } from 'next'
import { Fraunces, Caveat, Work_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

const workSans = Work_Sans({
  variable: '--font-work-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Resumely — Craftsman Career & Resume Studio',
  description:
    'Build tactile, ATS-optimized resumes with real-time editorial AI intelligence, custom master profiles, and instant PDF rendering.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${fraunces.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-paper text-ink selection:bg-mustard/30 selection:text-ink">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
