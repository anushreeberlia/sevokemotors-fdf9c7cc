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
  category: string;
  fuelType: string;
  mileage: string;
  transmission: string;
}

const CarInventory = () => {
  const [cars, setCars] = useState<Car[]>([
    {
      id: 'alto',
      name: 'Alto',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
      price: '₹3.54 - 5.09 Lakh',
      features: ['Compact Design', 'Fuel Efficient', 'Easy Parking', 'Low Maintenance'],
      category: 'Hatchback',
      fuelType: 'Petrol',
      mileage: '24.7 km/l',
      transmission: 'Manual/AMT'
    },
    {
      id: 'wagon-r',
      name: 'Wagon R',
      image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=400&h=300&fit=crop',
      price: '₹5.54 - 7.44 Lakh',
      features: ['Spacious Interior', 'Tall Boy Design', 'Advanced Safety', 'Smart Features'],
      category: 'Hatchback',
      fuelType: 'Petrol/CNG',
      mileage: '25.19 km/l',
      transmission: 'Manual/AGS'
    },
    {
      id: 'swift',
      name: 'Swift',
      image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=400&h=300&fit=crop',
      price: '₹5.85 - 8.67 Lakh',
      features: ['1.2L Petrol Engine', 'AMT Available', 'SmartPlay Studio', 'Sporty Design'],
      category: 'Hatchback',
      fuelType: 'Petrol',
      mileage: '21.85 km/l',
      transmission: 'Manual/AMT'
    },
    {
      id: 'baleno',
      name: 'Baleno',
      image: 'https://images.unsplash.com/photo-1549317336-206569e8475c?w=400&h=300&fit=crop',
      price: '₹6.35 - 9.49 Lakh',
      features: ['DualJet Engine', 'Premium Interior', '360° Camera', 'NEXA Experience'],
      category: 'Premium Hatchback',
      fuelType: 'Petrol',
      mileage: '22.94 km/l',
      transmission: 'Manual/CVT'
    },
    {
      id: 'dzire',
      name: 'Dzire',
      image: 'https://images.unsplash.com/photo-1558618666-4c911458b939?w=400&h=300&fit=crop',
      price: '₹6.51 - 9.39 Lakh',
      features: ['Spacious Sedan', 'Boot Space', 'AGS Technology', 'Elegant Design'],
      category: 'Sedan',
      fuelType: 'Petrol/CNG',
      mileage: '24.12 km/l',
      transmission: 'Manual/AGS'
    },
    {
      id: 'vitara-brezza',
      name: 'Vitara Brezza',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
      price: '₹8.34 - 14.15 Lakh',
      features: ['SUV Design', 'Ground Clearance', 'SmartPlay Pro+', 'Bold & Tough'],
      category: 'Compact SUV',
      fuelType: 'Petrol',
      mileage: '18.76 km/l',
      transmission: 'Manual/AT'
    }
  ]);
  
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const categories = ['All', 'Hatchback', 'Premium Hatchback', 'Sedan', 'Compact SUV'];

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter(car => car.category === selectedCategory));
    }
  }, [selectedCategory, cars]);

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
        console.log('Intelligent scraping completed');
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
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Inventory</h2>
            <p className="text-gray-600">Browse our entire collection of Maruti Suzuki vehicles</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
            <button
              onClick={triggerScraping}
              disabled={loading}
              className="bg-maruti-orange hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? '🔄 Updating...' : '🔄 Refresh Images'}
            </button>
            
            {lastUpdated && (
              <span className="text-xs text-gray-500 self-center">
                Updated: {new Date(lastUpdated).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-maruti-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div key={car.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
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
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-semibold">
                  {car.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{car.name}</h3>
                <p className="text-2xl font-bold text-maruti-blue mb-4">{car.price}</p>
                
                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Fuel:</span>
                    <span className="font-medium ml-2">{car.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Mileage:</span>
                    <span className="font-medium ml-2">{car.mileage}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">Transmission:</span>
                    <span className="font-medium ml-2">{car.transmission}</span>
                  </div>
                </div>
                
                {/* Features */}
                <div className="space-y-1 mb-6">
                  {car.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-maruti-orange mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Link 
                    href={`/contact?model=${car.id}`}
                    className="flex-1 bg-maruti-orange hover:bg-orange-600 text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Get Quote
                  </Link>
                  <Link 
                    href={`/contact?action=test-drive&model=${car.id}`}
                    className="flex-1 border-2 border-maruti-blue text-maruti-blue hover:bg-maruti-blue hover:text-white text-center py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Test Drive
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No cars found in the selected category.</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-maruti-blue to-blue-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h3>
          <p className="text-lg opacity-90 mb-6">
            Our expert team can help you find the perfect Maruti Suzuki car for your needs and budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-maruti-blue hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Talk to Expert
            </Link>
            <Link 
              href="/contact?action=callback" 
              className="border-2 border-white hover:bg-white hover:text-maruti-blue px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Request Callback
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarInventory;