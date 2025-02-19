/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        gotham: ['var(--font-gotham)'],
        lora: ['var(--font-lora)'],
      },
      textShadow: {
        'hero': '0.0625rem 0.0625rem 0.375rem rgba(0,0,0,0.7)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-shadow-hero': {
          'text-shadow': '0.0625rem 0.0625rem 0.375rem rgba(0,0,0,0.7)',
        },
      })
    },
  ],
} 