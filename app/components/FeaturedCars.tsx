import Image from 'next/image'
import Link from 'next/link'

const featuredCars = [
  {
    id: 1,
    name: 'Swift',
    model: '2024',
    price: '₹6.49 - 9.64 Lakh',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop',
    features: ['5-Speed MT', 'ABS with EBD', 'Dual Airbags']
  },
  {
    id: 2,
    name: 'Baleno',
    model: '2024',
    price: '₹6.66 - 9.83 Lakh',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
    features: ['Smart Hybrid', 'SmartPlay Studio', 'UV Cut Glass']
  },
  {
    id: 3,
    name: 'Vitara Brezza',
    model: '2024',
    price: '₹8.34 - 14.14 Lakh',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
    features: ['6 Airbags', 'ESP', '360° View Camera']
  }
]

export default function FeaturedCars() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Vehicles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most popular Maruti Suzuki models with the latest features and competitive pricing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <div key={car.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src={car.image}
                  alt={`${car.name} ${car.model}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-maruti-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                  New {car.model}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Maruti Suzuki {car.name}
                </h3>
                <p className="text-maruti-blue font-semibold text-xl mb-4">
                  {car.price}
                </p>
                <ul className="space-y-1 mb-6">
                  {car.features.map((feature, index) => (
                    <li key={index} className="text-gray-600 text-sm flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3">
                  <Link 
                    href="/contact" 
                    className="flex-1 bg-maruti-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-center font-semibold transition-colors"
                  >
                    Get Quote
                  </Link>
                  <Link 
                    href="/contact" 
                    className="flex-1 border-2 border-maruti-orange text-maruti-orange hover:bg-maruti-orange hover:text-white px-4 py-2 rounded-lg text-center font-semibold transition-colors"
                  >
                    Test Drive
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/inventory" 
            className="inline-flex items-center bg-maruti-blue hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            View All Cars
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}