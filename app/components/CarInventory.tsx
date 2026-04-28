'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const allCars = [
  {
    id: 1,
    name: 'Swift',
    model: '2024',
    price: '₹6.49 - 9.64 Lakh',
    image: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop',
    category: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Manual',
    features: ['5-Speed MT', 'ABS with EBD', 'Dual Airbags', 'SmartPlay Studio']
  },
  {
    id: 2,
    name: 'Baleno',
    model: '2024',
    price: '₹6.66 - 9.83 Lakh',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
    category: 'Hatchback',
    fuelType: 'Petrol',
    transmission: 'Manual',
    features: ['Smart Hybrid', 'SmartPlay Studio', 'UV Cut Glass', '6 Airbags']
  },
  {
    id: 3,
    name: 'Dzire',
    model: '2024',
    price: '₹6.79 - 10.14 Lakh',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    category: 'Sedan',
    fuelType: 'Petrol',
    transmission: 'Manual',
    features: ['AGS Available', 'SmartPlay Studio', 'Dual Airbags', 'ABS with EBD']
  },
  {
    id: 4,
    name: 'Vitara Brezza',
    model: '2024',
    price: '₹8.34 - 14.14 Lakh',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
    category: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Manual',
    features: ['6 Airbags', 'ESP', '360° View Camera', 'Cruise Control']
  },
  {
    id: 5,
    name: 'Ertiga',
    model: '2024',
    price: '₹8.69 - 13.03 Lakh',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop',
    category: 'MPV',
    fuelType: 'Petrol',
    transmission: 'Manual',
    features: ['7-Seater', 'SmartPlay Pro+', 'Dual Airbags', 'ABS with EBD']
  },
  {
    id: 6,
    name: 'XL6',
    model: '2024',
    price: '₹11.61 - 14.77 Lakh',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop',
    category: 'MPV',
    fuelType: 'Petrol',
    transmission: 'Manual',
    features: ['Premium Captain Seats', 'SmartPlay Pro+', '6 Airbags', 'ESP']
  },
  {
    id: 7,
    name: 'Grand Vitara',
    model: '2024',
    price: '₹10.70 - 19.94 Lakh',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop',
    category: 'SUV',
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    features: ['Strong Hybrid', 'AWD Available', '6 Airbags', 'HUD']
  },
  {
    id: 8,
    name: 'Jimny',
    model: '2024',
    price: '₹12.74 - 15.05 Lakh',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
    category: 'SUV',
    fuelType: 'Petrol',
    transmission: 'Manual',
    features: ['4WD', 'AllGrip Pro', 'Dual Airbags', 'ABS with EBD']
  }
]

const categories = ['All', 'Hatchback', 'Sedan', 'SUV', 'MPV']
const fuelTypes = ['All', 'Petrol', 'Hybrid']

export default function CarInventory() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedFuelType, setSelectedFuelType] = useState('All')

  const filteredCars = allCars.filter(car => {
    return (selectedCategory === 'All' || car.category === selectedCategory) &&
           (selectedFuelType === 'All' || car.fuelType === selectedFuelType)
  })

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-maruti-orange focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuel Type
            </label>
            <select 
              value={selectedFuelType}
              onChange={(e) => setSelectedFuelType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-maruti-orange focus:border-transparent"
            >
              {fuelTypes.map(fuelType => (
                <option key={fuelType} value={fuelType}>{fuelType}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-gray-600 mb-8">
          Showing {filteredCars.length} of {allCars.length} vehicles
        </p>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image
                  src={car.image}
                  alt={`${car.name} ${car.model}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-maruti-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {car.category}
                </div>
                <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                  {car.model}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Maruti Suzuki {car.name}
                </h3>
                <p className="text-maruti-blue font-semibold text-xl mb-2">
                  {car.price}
                </p>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Fuel: {car.fuelType}</span>
                  <span>Transmission: {car.transmission}</span>
                </div>
                <ul className="space-y-1 mb-6">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-gray-600 text-sm flex items-center">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                  {car.features.length > 3 && (
                    <li className="text-gray-500 text-sm ml-6">
                      +{car.features.length - 3} more features
                    </li>
                  )}
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

        {/* No results */}
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No vehicles match your current filters.</p>
            <button 
              onClick={() => {
                setSelectedCategory('All')
                setSelectedFuelType('All')
              }}
              className="mt-4 text-maruti-orange hover:text-orange-600 font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}