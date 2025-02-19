'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SlideMenu from './slide-menu'

interface SecondaryHeaderProps {
  title?: string
}

export default function SecondaryHeader({ title }: SecondaryHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#008c15]">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/tabra-logo.png"
                alt="Tabra"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>
            
            <button 
              className="text-white p-2 hover:opacity-80 transition-opacity"
              aria-label="Toggle menu"
              onClick={() => setIsMenuOpen(true)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-8 w-8" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16" 
                />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      <SlideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
  )
}