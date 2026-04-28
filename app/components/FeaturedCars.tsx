import React from 'react';
import Image from 'next/image';

const FeaturedCars = () => {
  const cars = [
    { id: 1, name: 'Swift', image: '/images/swift.jpg' },
    { id: 2, name: 'Baleno', image: '/images/baleno.jpg' },
    { id: 3, name: 'Vitara Brezza', image: '/images/vitara-brezza.jpg' },
  ];

  return (
    <section>
      <h2>Featured Cars</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {cars.map(car => (
          <div key={car.id} className='border rounded overflow-hidden shadow-lg'>
            <Image src={car.image} alt={car.name} width={300} height={200} />
            <h3 className='text-center text-lg font-semibold'>{car.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCars;