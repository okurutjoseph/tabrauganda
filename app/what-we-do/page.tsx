'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import { useState } from "react"

export default function WhatWeDo() {
  const services = useQuery(api.services.getAll)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (serviceId: string) => {
    setImageErrors(prev => ({ ...prev, [serviceId]: true }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            What We Do
          </h1>
          <p className="mt-4 text-lg text-center max-w-2xl mx-auto">
            Discover our range of services and initiatives that help put God's love into action in our communities.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {service.imageUrl && !imageErrors[service._id.toString()] ? (
                <div className="relative h-48 w-full bg-gray-100">
                  <Image
                    src={service.imageUrl}
                    alt={service.projectName}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={() => handleImageError(service._id.toString())}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    className="transition-opacity duration-300 opacity-0 hover:opacity-100"
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement
                      target.classList.remove('opacity-0')
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse bg-gray-200 w-full h-full" />
                  </div>
                </div>
              ) : (
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.projectName}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {services === undefined && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {services?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">No services available yet.</h3>
          </div>
        )}
      </div>
    </div>
  )
}
