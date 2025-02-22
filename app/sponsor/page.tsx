'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import { useState } from "react"

export default function Sponsor() {
  const supportCases = useQuery(api.support.getAll)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [activeCategory, setActiveCategory] = useState<'all' | 'mother' | 'child'>('all')

  const handleImageError = (caseId: string) => {
    setImageErrors(prev => ({ ...prev, [caseId]: true }))
  }

  const filteredCases = supportCases?.filter(supportCase => 
    activeCategory === 'all' || supportCase.category === activeCategory
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Sponsor a Mother or Child
          </h1>
          <p className="mt-4 text-lg text-center max-w-2xl mx-auto">
            Make a difference in someone's life by providing support to mothers and children in need.
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container mx-auto px-4 pt-8">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('mother')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeCategory === 'mother'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mothers
          </button>
          <button
            onClick={() => setActiveCategory('child')}
            className={`px-6 py-2 rounded-full transition-colors ${
              activeCategory === 'child'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Children
          </button>
        </div>
      </div>

      {/* Support Cases Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCases?.map((supportCase) => (
            <div
              key={supportCase._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-64 w-full bg-gray-100">
                {supportCase.imageUrl && !imageErrors[supportCase._id.toString()] ? (
                  <Image
                    src={supportCase.imageUrl}
                    alt={supportCase.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={() => handleImageError(supportCase._id.toString())}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                    className="transition-opacity duration-300 opacity-0 hover:opacity-100"
                    onLoad={(e) => {
                      const target = e.target as HTMLImageElement
                      target.classList.remove('opacity-0')
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    supportCase.category === 'mother' 
                      ? 'bg-pink-100 text-pink-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {supportCase.category === 'mother' ? 'Mother' : 'Child'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {supportCase.name}
                    </h3>
                    <div className="mt-1 text-sm text-gray-500">
                      Age: {supportCase.age} • {supportCase.location}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  {supportCase.story}
                </p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Sponsor Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {supportCases === undefined && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Empty State */}
        {filteredCases?.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl text-gray-600">
              {activeCategory === 'all'
                ? 'No support cases available yet.'
                : `No ${activeCategory}s available for sponsorship at the moment.`}
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}
