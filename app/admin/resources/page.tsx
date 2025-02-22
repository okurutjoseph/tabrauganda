'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUploadThing } from '@/lib/uploadthing'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

export default function ResourcesAdmin() {
  const router = useRouter()
  const [resourceName, setResourceName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [resourceType, setResourceType] = useState<'document' | 'link'>('document')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [resourceUrl, setResourceUrl] = useState<string>('')
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const { startUpload: startImageUpload } = useUploadThing("imageUploader")
  const { startUpload: startDocumentUpload } = useUploadThing("documentUploader")
  const createResource = useMutation(api.resources.create)

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

  const isFormValid = () => {
    if (!resourceName.trim() || !description.trim()) return false
    if (resourceType === 'document' && !documentFile) return false
    if (resourceType === 'link' && !resourceUrl.trim()) return false
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setIsUploading(true)

    try {
      let thumbnailUrl = undefined
      let documentUrl = undefined
      let finalResourceUrl = undefined

      // Upload thumbnail if exists
      if (thumbnailFile) {
        try {
          const thumbnailResult = await startImageUpload([thumbnailFile])
          if (thumbnailResult && thumbnailResult[0]) {
            thumbnailUrl = thumbnailResult[0].url
          }
        } catch (error) {
          console.error('Error uploading thumbnail:', error)
          toast.error('Failed to upload thumbnail')
          setIsUploading(false)
          return
        }
      }

      // Upload document if it's a document type resource
      if (resourceType === 'document' && documentFile) {
        try {
          const documentResult = await startDocumentUpload([documentFile])
          if (documentResult && documentResult[0]) {
            documentUrl = documentResult[0].url
          }
        } catch (error) {
          console.error('Error uploading document:', error)
          toast.error('Failed to upload document')
          setIsUploading(false)
          return
        }
      } else if (resourceType === 'link') {
        finalResourceUrl = resourceUrl.trim()
      }

      // Create resource in Convex
      try {
        await createResource({
          name: resourceName.trim(),
          description: description.trim(),
          resourceType,
          resourceUrl: finalResourceUrl,
          documentUrl,
          thumbnailUrl,
        })

        // Show success message
        toast.success('Resource created successfully!')

        // Reset form
        setResourceName('')
        setDescription('')
        setDocumentFile(null)
        setResourceUrl('')
        setThumbnailFile(null)
        setThumbnailPreview('')
        setIsUploading(false)

        // Refresh the page
        router.refresh()

      } catch (error) {
        console.error('Error saving to Convex:', error)
        toast.error('Failed to save resource data')
        setIsUploading(false)
      }

    } catch (error) {
      console.error('Error creating resource:', error)
      toast.error('Failed to create resource. Please try again.')
      setIsUploading(false)
    }
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
            placeholder="Enter resource name"
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
              required={resourceType === 'document'}
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
              required={resourceType === 'link'}
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
            disabled={isUploading || !isFormValid()}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
              (isUploading || !isFormValid()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Saving...' : 'Save Resource'}
          </button>
        </div>
      </form>
    </div>
  )
}