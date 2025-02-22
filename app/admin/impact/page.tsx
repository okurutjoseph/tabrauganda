'use client'

import { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import Image from 'next/image'

export default function ImpactAdmin() {
  const [heading, setHeading] = useState('')
  const [description, setDescription] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [videoUrl, setVideoUrl] = useState('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log({ heading, description, mediaType, imageFile, videoUrl })
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Add Impact Story</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Media Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="image"
                checked={mediaType === 'image'}
                onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Image</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="video"
                checked={mediaType === 'video'}
                onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Video</span>
            </label>
          </div>
        </div>

        {mediaType === 'image' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Impact preview"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-gray-500 text-sm">No image</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube or Vimeo URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Impact Heading
          </label>
          <input
            type="text"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <Editor
            apiKey="your-tinymce-api-key" // You'll need to get this from TinyMCE
            value={description}
            onEditorChange={(content) => setDescription(content)}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            }}
          />
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Impact Story
          </button>
        </div>
      </form>
    </div>
  )
} 