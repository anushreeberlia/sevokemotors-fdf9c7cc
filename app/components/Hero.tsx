import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-maruti-blue to-blue-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Your Dream Car
              <span className="block text-maruti-orange">Awaits You</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover the latest Maruti Suzuki models with unbeatable prices and exceptional service at Sevoke Motors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/inventory" 
                className="bg-maruti-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors text-center"
              >
                Browse Cars
              </Link>
              <Link 
                href="/contact" 
                className="border-2 border-white hover:bg-white hover:text-maruti-blue text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors text-center"
              >
                Schedule Test Drive
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=600&h=400&fit=crop"
                alt="Latest Maruti Suzuki car"
                fill
                className="object-cover"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-maruti-orange text-white px-6 py-3 rounded-lg shadow-lg">
              <p className="text-sm font-semibold">Best Prices</p>
              <p className="text-xs">Guaranteed</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="relative bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-maruti-blue">15+</p>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-maruti-blue">5000+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-maruti-blue">50+</p>
              <p className="text-gray-600">Car Models</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-maruti-blue">24/7</p>
              <p className="text-gray-600">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}