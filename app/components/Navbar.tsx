'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-maruti-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">SM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sevoke Motors</h1>
              <p className="text-xs text-maruti-blue">Authorized Maruti Suzuki Dealer</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-maruti-orange transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-maruti-orange transition-colors">
              About Us
            </Link>
            <Link href="/inventory" className="text-gray-700 hover:text-maruti-orange transition-colors">
              Inventory
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-maruti-orange transition-colors">
              Contact
            </Link>
            <Link 
              href="/contact" 
              className="bg-maruti-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-maruti-orange focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-maruti-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-maruti-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/inventory" 
                className="text-gray-700 hover:text-maruti-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inventory
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-maruti-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link 
                href="/contact" 
                className="bg-maruti-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors inline-block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}