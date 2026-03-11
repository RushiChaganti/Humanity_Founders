import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

import { ThemeProvider } from '@/components/theme-provider'

export const metadata: Metadata = {
  title: 'Humanity Founders Console',
  description: 'Create and manage intelligent safety forms with conditional logic, versioning, and submission tracking',
  keywords: ['forms', 'safety', 'dynamic', 'conditional logic', 'versioning'],
  generator: 'v0.app',
  icons: {
    icon: '/hf-logo.png',
    apple: '/hf-logo.png',
  },
  openGraph: {
    title: 'Dynamic Safety Form Engine',
    description: 'Create intelligent forms with conditional logic and versioning',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen relative">
        <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" disableTransitionOnChange>
          <div className="fixed inset-0 grid-background pointer-events-none z-0 opacity-50" />
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
