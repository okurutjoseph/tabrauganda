import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /admin, /admin/services)
  const path = request.nextUrl.pathname

  // Check if the path starts with /admin
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Redirect to login if not authenticated
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: '/admin/:path*'
} 