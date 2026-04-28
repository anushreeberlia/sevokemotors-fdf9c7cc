'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Car {
  id: string;
  name: string;
  image: string;
  price: string;
  features: string[];
  description?: string;
}

const FeaturedCars = () => {
  const [cars, setCars] = useState<Car[]>([
    {
      id: 'swift',
      name: 'Swift',
      image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=400&h=300&fit=crop',
      price: '₹5.85 - 8.67 Lakh',
      features: ['1.2L Petrol Engine', 'AMT Available', '21.85 km/l', 'SmartPlay Studio'],
      description: 'The perfect blend of style, performance, and efficiency'
    },
    {
      id: 'baleno',
      name: 'Baleno',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
      price: '₹6.35 - 9.49 Lakh',
      features: ['1.2L DualJet Engine', 'Nexa Premium', '22.94 km/l', '360° View Camera'],
      description: 'Premium hatchback with sophisticated design and technology'
    },
    {
      id: 'dzire',
      name: 'Dzire',
      image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=400&h=300&fit=crop',
      price: '₹6.51 - 9.39 Lakh',
      features: ['1.2L Petrol Engine', 'Spacious Sedan', '24.12 km/l', 'AGS Technology'],
      description: 'Compact sedan that delivers on space, comfort, and fuel efficiency'
    },
    {
      id: 'vitara-brezza',
      name: 'Vitara Brezza',
      image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop',
      price: '₹8.34 - 14.15 Lakh',
      features: ['1.5L Petrol Engine', 'SUV Design', '18.76 km/l', 'SmartPlay Pro+'],
      description: 'Compact SUV with bold design and advanced features'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const loadScrapedImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/images');
      const data = await response.json();
      
      if (data.success && data.images && data.images.length > 0) {
        // Update cars with scraped images
        const updatedCars = cars.map(car => {
          const carImages = data.images.filter((img: any) => {
            if (!img.model || !img.filename) return false;
            return img.model === car.id || 
                   img.filename.toLowerCase().includes(car.id.replace('-', '')) ||
                   img.filename.toLowerCase().includes(car.name.toLowerCase());
          });
          
          if (carImages.length > 0) {
            return {
              ...car,
              image: `/images/cars/${carImages[0].filename}`
            };
          }
          return car;
        });
        
        setCars(updatedCars);
        setLastUpdated(data.lastUpdated);
      }
    } catch (error) {
      console.error('Failed to load scraped images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScrapedImages();
  }, []);

  const triggerScraping = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scrape', { method: 'GET' });
      const result = await response.json();
      
      if (result.success) {
        console.log('Scraping completed successfully');
        // Reload images after scraping
        await loadScrapedImages();
      } else {
        console.error('Scraping failed:', result.error);
      }
    } catch (error) {
      console.error('Failed to trigger scraping:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Cars
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover our most popular Maruti Suzuki models with exceptional features and value
          </p>
          
          {/* Admin controls */}
          <div className="flex justify-center items-center gap-4 mb-6">
            <button
              onClick={triggerScraping}
              disabled={loading}
              className="bg-maruti-orange hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? '🔄 Updating Images...' : '🔄 Refresh Images'}
            </button>
            
            {lastUpdated && (
              <span className="text-sm text-gray-500">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=400&h=300&fit=crop';
                  }}
                />
                <div className="absolute top-4 right-4 bg-maruti-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Popular
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{car.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{car.description}</p>
                <p className="text-2xl font-bold text-maruti-blue mb-4">{car.price}</p>
                
                <div className="space-y-2 mb-6">
                  {car.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-maruti-orange mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-3">
                  <Link 
                    href={`/inventory#${car.id}`}
                    className="flex-1 bg-maruti-blue hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    View Details
                  </Link>
                  <Link 
                    href="/contact"
                    className="flex-1 border-2 border-maruti-orange text-maruti-orange hover:bg-maruti-orange hover:text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/inventory" 
            className="bg-maruti-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2"
          >
            View All Cars
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;