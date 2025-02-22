'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUploadThing } from '@/lib/uploadthing'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Toaster, toast } from 'sonner' // Import Toaster component

export default function ServicesAdmin() {
  const router = useRouter()
  const [projectName, setProjectName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const { startUpload } = useUploadThing("imageUploader")
  const createService = useMutation(api.services.create)

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
    if (!projectName.trim() || !description.trim()) {
      return
    }
    
    setIsUploading(true)

    try {
      let imageUrl = undefined

      if (imageFile) {
        const uploadResult = await startUpload([imageFile])
        if (uploadResult && uploadResult[0]) {
          imageUrl = uploadResult[0].url
        }
      }

      await createService({
        projectName: projectName.trim(),
        description: description.trim(),
        imageUrl,
      })

      // Show success message
      toast.success('Service created successfully!')

      // Reset form
      setProjectName('')
      setDescription('')
      setImageFile(null)
      setImagePreview('')
      setIsUploading(false)

      // Refresh the page
      router.refresh()

    } catch (error) {
      console.error('Error creating service:', error)
      toast.error('Failed to create service. Please try again.')
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6">
      <Toaster /> {/* Add Toaster component */}
      <h2 className="text-2xl font-semibold mb-6">Add New Service</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Image
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Project preview"
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter project name"
          />
        </div>

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
            placeholder="Enter service description..."
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isUploading || !projectName.trim() || !description.trim()}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors ${
              (isUploading || !projectName.trim() || !description.trim()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isUploading ? 'Saving...' : 'Save Service'}
          </button>
        </div>
      </form>
    </div>
  )
}