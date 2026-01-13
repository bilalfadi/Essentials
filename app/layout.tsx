import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CurrencyProvider } from '@/contexts/CurrencyContext'

export const metadata: Metadata = {
  title: 'Essentials Official - Premium Streetwear | Essentials Jacket',
  description: 'Essentials Official - Premium Streetwear Collection. Shop Essentials hoodies, t-shirts, jackets, tracksuits, and more at essentialsjacket.com',
  metadataBase: new URL('https://essentialsjacket.com'),
  verification: {
    google: 'oqWGYYR64FnVTD73sYfRzhbcmib_ANpX11ZDFdYgg5Q',
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/',
  },
  icons: {
    icon: [
      { url: '/Essentials.jpeg', sizes: 'any' },
    ],
    shortcut: '/Essentials.jpeg',
    apple: '/Essentials.jpeg',
  },
  openGraph: {
    title: 'Essentials Official - Premium Streetwear',
    description: 'Essentials Official - Premium Streetwear Collection',
    url: 'https://essentialsjacket.com',
    siteName: 'Essentials Official',
    type: 'website',
    images: [
      {
        url: 'https://essentialsjacket.com/Essentials.jpeg',
        alt: 'Essentials Official',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essentials Official - Premium Streetwear',
    description: 'Essentials Official - Premium Streetwear Collection',
    images: ['https://essentialsjacket.com/Essentials.jpeg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CurrencyProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  )
}

