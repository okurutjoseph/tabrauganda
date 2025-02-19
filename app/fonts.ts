import localFont from 'next/font/local'
import { Lora } from 'next/font/google'

export const gotham = localFont({
  src: [
    {
      path: '../public/fonts/Gotham-Book.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Gotham-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Gotham-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gotham'
})

export const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora'
}) 