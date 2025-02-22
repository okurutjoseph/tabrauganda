'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useUploadThing } from '@/lib/uploadthing'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

export default function SupportAdmin() {
  const router = useRouter()
  const [category, setCategory] = useState<'mother' | 'child'>('mother')
  const [name, setName] = useState<string>('')
  const [age, setAge] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [story, setStory] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const { startUpload } = useUploadThing("imageUploader")
  const createSupport = useMutation(api.support.create)

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

  const isFormValid = () => {
    if (!name.trim() || !age || !location.trim() || !story.trim()) return false
    const ageNum = parseInt(age)
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) return false
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid()) return
    
    setIsUploading(true)

    try {
      let imageUrl = undefined

      if (imageFile) {
        const uploadResult = await startUpload([imageFile])
        if (uploadResult && uploadResult[0]) {
          imageUrl = uploadResult[0].url
        }
      }

      await createSupport({
        category,
        name: name.trim(),
        age: parseInt(age),
        location: location.trim(),
        story: story.trim(),
        imageUrl,
      })

      // Show success message
      toast.success('Support case created successfully!')

      // Reset form
      setName('')
      setAge('')
      setLocation('')
      setStory('')
      setImageFile(null)
      setImagePreview('')
      setIsUploading(false)

      // Refresh the page
      router.refresh()

    } catch (error) {
      console.error('Error creating support case:', error)
      toast.error('Failed to create support case. Please try again.')
      setIsUploading(false)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Add Support Case</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="mother"
                checked={category === 'mother'}
                onChange={(e) => setCategory(e.target.value as 'mother' | 'child')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Mother</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="child"
                checked={category === 'child'}
                onChange={(e) => setCategory(e.target.value as 'mother' | 'child')}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Child</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Person Image
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Person preview"
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
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter person's name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="0"
            max="150"
            placeholder="Enter person's age"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter person's location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Story
          </label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Enter person's story..."
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
            {isUploading ? 'Saving...' : 'Save Support Case'}
          </button>
        </div>
      </form>
    </div>
  )
} 