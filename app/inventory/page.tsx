import type { Metadata } from 'next'
import CarInventory from '../components/CarInventory'

export const metadata: Metadata = {
  title: 'Car Inventory - Latest Maruti Suzuki Models | Sevoke Motors',
  description: 'Browse our extensive inventory of new Maruti Suzuki cars. Find your perfect vehicle from Swift, Baleno, Dzire, Vitara Brezza, and more. Best prices and financing available.',
}

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-maruti-blue text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Car Inventory
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Discover our latest collection of Maruti Suzuki vehicles
            </p>
          </div>
        </div>
      </section>

      <CarInventory />
    </div>
  )
}