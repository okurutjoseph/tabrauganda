'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ResourcesAdmin() {
  const [resourceName, setResourceName] = useState('')
  const [description, setDescription] = useState('')
  const [resourceType, setResourceType] = useState<'document' | 'link'>('document')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [resourceUrl, setResourceUrl] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocumentFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement form submission
    console.log({
      resourceName,
      description,
      resourceType,
      documentFile,
      resourceUrl,
      thumbnailFile
    })
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Add Resource</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resource Type
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="document"
                checked={resourceType === 'document'}
                onChange={(e) => setResourceType(e.target.value as 'document' | 'link')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Document</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="link"
                checked={resourceType === 'link'}
                onChange={(e) => setResourceType(e.target.value as 'document' | 'link')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">External Link</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resource Name
          </label>
          <input
            type="text"
            value={resourceName}
            onChange={(e) => setResourceName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail Image
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              {thumbnailPreview ? (
                <Image
                  src={thumbnailPreview}
                  alt="Resource thumbnail"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-500 text-sm">No thumbnail</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>

        {resourceType === 'document' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleDocumentChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource URL
            </label>
            <input
              type="url"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              placeholder="Enter resource URL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter resource description..."
          />
        </div>

        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Resource
          </button>
        </div>
      </form>
    </div>
  )
}