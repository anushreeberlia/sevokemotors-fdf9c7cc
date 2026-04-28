import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Sevoke Motors - Your Trusted Maruti Suzuki Partner',
  description: 'Learn about Sevoke Motors, a leading Maruti Suzuki dealership with years of experience in automotive excellence. Our mission is to provide exceptional car buying and service experience.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-maruti-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Sevoke Motors</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Your trusted Maruti Suzuki partner for over a decade
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Established in 2010, Sevoke Motors has been serving the automotive needs of our community with dedication and excellence. As an authorized Maruti Suzuki dealership, we've helped thousands of families find their perfect vehicle.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our commitment to customer satisfaction, transparent dealings, and after-sales service has made us one of the most trusted automotive destinations in the region.
              </p>
              <p className="text-lg text-gray-600">
                We believe in building long-term relationships with our customers, providing not just cars, but complete automotive solutions for life.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1562141961-401776494e67?w=600&h=400&fit=crop"
                alt="Sevoke Motors showroom"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center p-8 bg-maruti-light rounded-lg">
              <div className="w-16 h-16 bg-maruti-orange rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide exceptional automotive experiences through quality products, transparent services, and customer-centric approach, making car ownership a joy for every family.
              </p>
            </div>
            <div className="text-center p-8 bg-maruti-light rounded-lg">
              <div className="w-16 h-16 bg-maruti-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the most trusted and preferred automotive partner in the region, setting benchmarks in customer satisfaction and automotive excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Expert Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced professionals are dedicated to providing you with the best automotive experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rajesh Kumar</h3>
              <p className="text-maruti-orange font-medium mb-2">General Manager</p>
              <p className="text-gray-600 text-sm">15+ years in automotive industry</p>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Priya Sharma</h3>
              <p className="text-maruti-orange font-medium mb-2">Sales Manager</p>
              <p className="text-gray-600 text-sm">10+ years in automotive sales</p>
            </div>
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Amit Singh</h3>
              <p className="text-maruti-orange font-medium mb-2">Service Manager</p>
              <p className="text-gray-600 text-sm">12+ years in automotive service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}