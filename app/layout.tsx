import type { Metadata } from 'next'
import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const metadata: Metadata = {
  title: 'Sevoke Motors - Premium Maruti Suzuki Dealership | Buy Maruti Cars',
  description: 'Sevoke Motors is your trusted Maruti Suzuki dealership offering new cars, genuine parts, and expert service. Discover the latest Maruti Suzuki models with best prices and financing options.',
  keywords: 'Maruti Suzuki dealership, buy Maruti cars, Sevoke Motors, new cars, car financing, Maruti service center, genuine parts',
  openGraph: {
    title: 'Sevoke Motors - Premium Maruti Suzuki Dealership',
    description: 'Your trusted partner for Maruti Suzuki cars, service, and genuine parts. Experience excellence in automotive retail.',
    type: 'website',
    locale: 'en_IN',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  name: 'Sevoke Motors',
  description: 'Premium Maruti Suzuki dealership offering new cars, service, and genuine parts',
  url: 'https://sevokemotors.com',
  telephone: '+91-98765-43210',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Sevoke Road',
    addressLocality: 'Siliguri',
    addressRegion: 'West Bengal',
    postalCode: '734001',
    addressCountry: 'IN'
  },
  brand: {
    '@type': 'Brand',
    name: 'Maruti Suzuki'
  },
  openingHours: 'Mo-Sa 09:00-18:00',
  priceRange: '₹₹₹'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}