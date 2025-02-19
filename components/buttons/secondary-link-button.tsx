import Link from 'next/link'
import { gotham } from '@/app/fonts'

interface SecondaryLinkButtonProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function SecondaryLinkButton({ 
  href, 
  children, 
  className = '' 
}: SecondaryLinkButtonProps) {
  return (
    <Link
      href={href}
      className={`
        inline-block
        font-gotham
        text-[18px]
        text-white
        mt-5
        bg-[#008c15]
        hover:bg-[#006b0c]
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