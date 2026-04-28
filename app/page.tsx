import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Hero from './components/Hero'
import FeaturedCars from './components/FeaturedCars'
import SpecialOffers from './components/SpecialOffers'
import WhyChooseUs from './components/WhyChooseUs'

export const metadata: Metadata = {
  title: 'Sevoke Motors - Premium Maruti Suzuki Dealership | New Cars & Service',
  description: 'Welcome to Sevoke Motors, your trusted Maruti Suzuki dealership. Explore new car models, special offers, and professional automotive services. Best prices guaranteed.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <SpecialOffers />
      <FeaturedCars />
      <WhyChooseUs />
    </div>
  )
}