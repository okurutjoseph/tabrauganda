'use client'

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import Image from "next/image"
import { useState } from "react"
import SecondaryHeader from '@/components/secondary-header'

export default function StoriesOfImpact() {
  const impactStories = useQuery(api.impact.getAll)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (storyId: string) => {
    setImageErrors(prev => ({ ...prev, [storyId]: true }))
  }

  const renderMedia = (story: any) => {
    if (story.mediaType === 'video' && story.mediaUrl) {
      // Extract video ID from YouTube URL
      const videoId = story.mediaUrl.split('v=')[1]?.split('&')[0]
      if (videoId) {
        return (
          <div className="relative h-48 w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )
      }
    } else if (story.mediaType === 'image' && story.mediaUrl && !imageErrors[story._id.toString()]) {
      return (
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={story.mediaUrl}
            alt={story.heading}
            fill
            style={{ objectFit: 'cover' }}
            onError={() => handleImageError(story._id.toString())}
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
      )
    } else {
      return (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">No media available</span>
        </div>
      )
    }
  }

  return (
    <>
      <SecondaryHeader title="Stories of Impact" />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-center">
              Stories of Impact
            </h1>
            <p className="mt-4 text-lg text-center max-w-2xl mx-auto">
              Witness the transformative impact of God's love in action through real stories from our community.
            </p>
          </div>
        </div>

        {/* Impact Stories Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {impactStories?.map((story) => (
              <div
                key={story._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {renderMedia(story)}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {story.heading}
                  </h3>
                  <p className="text-gray-600">
                    {story.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Loading State */}
          {impactStories === undefined && (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Empty State */}
          {impactStories?.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-600">No impact stories available yet.</h3>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
