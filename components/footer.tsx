import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full bg-[#008c15] text-white py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4">
          <p className="text-sm">© 2025 Tabra Uganda. All Rights Reserved.</p>
          <Link href="/privacy-policy" className="text-sm hover:opacity-80 transition-opacity">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/contact" className="text-sm hover:opacity-80 transition-opacity">
            Contact
          </Link>
        </div>
        
        <div className="flex items-center space-x-6 mt-6 md:mt-0">
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="/facebook.svg"
              alt="Facebook"
              width={24}
              height={24}
              className="hover:opacity-80 transition-opacity"
            />
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="/twitter.svg"
              alt="Twitter"
              width={24}
              height={24}
              className="hover:opacity-80 transition-opacity"
            />
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Image
              src="/instagram.svg"
              alt="Instagram"
              width={24}
              height={24}
              className="hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>
      </div>
    </footer>
  )
} 