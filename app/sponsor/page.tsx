'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import { useState } from "react"
import SecondaryHeader from '@/components/secondary-header'

export default function Sponsor() {
  const supportCases = useQuery(api.support.getAll)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const [activeCategory, setActiveCategory] = useState<'Child' | 'Mother'>('Child')

  const handleImageError = (caseId: string) => {
    setImageErrors(prev => ({ ...prev, [caseId]: true }))
  }

  // Add detailed logging
  if (supportCases) {
    console.log('Support Cases Data:', {
      raw: supportCases,
      categories: supportCases.map(item => item.category),
      imageUrls: supportCases.map(item => item.imageUrl)
    })
  }

  const categories = ['Child', 'Mother'] as const

  const filteredCases = supportCases?.filter(supportCase => 
    supportCase.category === activeCategory
  )

  return (
    <div>
      <SecondaryHeader title="Sponsor" />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white text-black py-16 pt-32">  {/* Added pt-32 for header spacing */}
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-center">
              <span className="text-black">SPONSOR</span>{' '}
              <span className="text-[#008c15]">A LIFE</span>.{' '}
              <span className="text-black">CHANGE</span>{' '}
              <span className="text-[#008c15]">A STORY</span>.
            </h1>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center space-x-8 text-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 transition-colors ${
                  activeCategory === category
                    ? 'text-[#008c15] border-b-2 border-[#008c15]'
                    : 'text-gray-500 hover:text-[#008c15]'
                }`}
              >
                {category.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gradient-to-r from-[#90EE90] via-[#008c15] to-[#0000FF] w-full"></div>

        {/* Support Cases Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases?.map((supportCase) => (
              <div
                key={supportCase._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative h-64 w-full bg-gray-100">
                  {supportCase.imageUrl ? (
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
                      supportCase.category === 'Mother' 
                        ? 'bg-pink-100 text-pink-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {supportCase.category}
                    </span>
                  </div>
                </div>
                {/* Add debug info */}
                <div className="p-2 bg-gray-100 text-xs">
                  <code>ID: {supportCase._id.toString()}</code>
                  <br />
                  <code>Category: {supportCase.category}</code>
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
                No support cases available for {activeCategory.toLowerCase()}s.
              </h3>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}