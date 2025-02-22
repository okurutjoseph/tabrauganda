'use client'

import { ConvexProvider, ConvexReactClient } from "convex/react"
import { useState, useEffect } from "react"

export default function Providers({ children }: { children: React.ReactNode }) {
  const [convex, setConvex] = useState<ConvexReactClient | null>(null)

  useEffect(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
    if (convexUrl) {
      const client = new ConvexReactClient(convexUrl)
      setConvex(client)
    }
  }, [])

  if (!convex) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
} 