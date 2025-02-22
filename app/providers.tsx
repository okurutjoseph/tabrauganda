'use client'

import { ConvexProvider, ConvexReactClient } from "convex/react"

// Use the environment variable or fallback to the production URL during build
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://healthy-porpoise-795.convex.cloud"
const convex = new ConvexReactClient(convexUrl)

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>
} 