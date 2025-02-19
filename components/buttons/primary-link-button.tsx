import Link from 'next/link'
import { gotham } from '@/app/fonts'

interface PrimaryLinkButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function PrimaryLinkButton({ 
  href, 
  children, 
  className = '' 
}: PrimaryLinkButtonProps) {
  return (
    <Link
      href={href}
      className={`
        inline-block
        font-gotham
        text-[18px]
        text-white
        mt-5
        bg-[#005ca7]
        hover:bg-[#004E98]
        rounded-[20px]
        font-bold
        uppercase
        no-underline
        border-2
        border-transparent
        px-[30px]
        py-[0.3em]
        transition-colors
        ${className}
      `}
    >
      {children}
    </Link>
  )
} 