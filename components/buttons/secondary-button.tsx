import { ButtonHTMLAttributes } from 'react'
import { gotham } from '@/app/fonts'

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export default function SecondaryButton({ 
  children, 
  className = '', 
  ...props 
}: SecondaryButtonProps) {
  return (
    <button
      className={`
        font-gotham
        text-[18px]
        text-white
        mt-5
        bg-[#008c15]
        hover:bg-[#006b0c]
        rounded-[20px]
        font-bold
        uppercase
        border-2
        border-transparent
        px-[30px]
        py-[0.3em]
        transition-colors
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
} 