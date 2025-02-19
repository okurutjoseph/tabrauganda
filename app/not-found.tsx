import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
        <p className="mb-8 text-gray-600">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
        <Link
          href="/"
          className="bg-[#008c15] text-white px-6 py-3 rounded hover:bg-[#007012] transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
} 