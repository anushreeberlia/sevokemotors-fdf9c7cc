import Link from 'next/link'

const offers = [
  {
    id: 1,
    title: 'Year End Sale',
    description: 'Get up to ₹50,000 off on select models',
    validTill: 'Valid till Dec 31, 2024',
    bgColor: 'bg-gradient-to-r from-maruti-orange to-orange-600'
  },
  {
    id: 2,
    title: 'Exchange Bonus',
    description: 'Additional ₹25,000 on car exchange',
    validTill: 'Limited time offer',
    bgColor: 'bg-gradient-to-r from-maruti-blue to-blue-600'
  },
  {
    id: 3,
    title: 'Easy EMI',
    description: 'Starting from ₹5,999/month',
    validTill: 'T&C Apply',
    bgColor: 'bg-gradient-to-r from-green-500 to-green-600'
  }
]

export default function SpecialOffers() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Special Offers
          </h2>
          <p className="text-lg text-gray-600">
            Don't miss out on our exclusive deals and limited-time offers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className={`${offer.bgColor} text-white rounded-xl p-6 shadow-lg`}>
              <h3 className="text-2xl font-bold mb-3">{offer.title}</h3>
              <p className="text-lg mb-4 opacity-90">{offer.description}</p>
              <p className="text-sm mb-6 opacity-75">{offer.validTill}</p>
              <Link 
                href="/contact" 
                className="inline-block bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Claim Offer
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help Choosing the Right Car?
            </h3>
            <p className="text-gray-600 mb-6">
              Our expert team is here to help you find the perfect Maruti Suzuki vehicle for your needs and budget.
            </p>
            <Link 
              href="/contact" 
              className="bg-maruti-orange hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Talk to Our Experts
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}