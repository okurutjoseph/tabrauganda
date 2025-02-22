'use client'

import { ConvexProvider, ConvexReactClient } from "convex/react"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL as string)

export default function Providers({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return null // or some loading state
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
} 