'use client'

import { ConvexProvider, ConvexReactClient } from "convex/react"

function getConvexClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

  // During build time or if URL is not set, return null
  if (typeof window === 'undefined' || !convexUrl) {
    return null
  }

  return new ConvexReactClient(convexUrl)
}

const convex = getConvexClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  // If no client (during build/SSR), just render children
  if (!convex) {
    return <>{children}</>
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
} 