import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /admin, /admin/services)
  const path = request.nextUrl.pathname

  // If trying to access admin pages (except login)
  if (path.startsWith('/admin') && path !== '/admin/login') {
    // Get the authentication token from cookies
    const authToken = request.cookies.get('adminAuthenticated')
    
    // If no auth token, redirect to login
    if (!authToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

// Configure the paths that should be handled by this middleware
export const config = {
  matcher: ['/admin/:path*']
} 