'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface SlideMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function SlideMenu({ isOpen, onClose }: SlideMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu */}
      <div 
        className={`fixed top-0 right-0 w-80 h-full bg-[#008c15] text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:opacity-80 p-2"
          aria-label="Close menu"
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
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>

        <nav className="pt-20 px-8">
          <ul className="space-y-6">
            <li><Link href="/" className="text-xl hover:opacity-80">HOME</Link></li>
            <li>
              <Link href="/what-we-do" className="text-xl hover:opacity-80 flex justify-between items-center">
                WHAT WE DO</Link></li>
            <li><Link href="/" className="text-xl hover:opacity-80">WHO WE ARE</Link></li>
            <li><Link href="/stories-of-impact" className="text-xl hover:opacity-80">STORIES OF IMPACT</Link></li>
            <li>
              <Link href="/" className="text-xl hover:opacity-80 flex justify-between items-center">
                GET INVOLVED</Link></li>
            <li>
              <Link href="/donate" className="text-xl hover:opacity-80 flex justify-between items-center">
                DONATE</Link></li>
                <li>
              <Link href="/sponsor" className="text-xl hover:opacity-80 flex justify-between items-center">
                SPONSOR</Link></li>
            <li><Link href="/contact" className="text-xl hover:opacity-80">CONTACT US</Link></li>
            <li><Link href="/" className="text-xl hover:opacity-80">STAY CONNECTED</Link></li>
          </ul>
        </nav>
      </div>
    </>
  )
} 