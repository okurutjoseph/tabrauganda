import { ButtonHTMLAttributes } from 'react'
import { gotham } from '@/app/fonts'

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
}

export default function PrimaryButton({ 
  children, 
  className = '', 
  ...props 
}: PrimaryButtonProps) {
  return (
    <button
      className={`
        font-gotham
        text-[18px]
        text-white
        mt-5
        bg-[#005ca7]
        hover:bg-[#004E98]
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