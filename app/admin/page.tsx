'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Cookies from 'js-cookie'
import { useUploadThing } from '@/lib/uploadthing'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'

// Sidebar item type
type SidebarItem = {
  name: string
  path: string
  icon?: React.ReactNode
}

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('services')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Add UploadThing hooks
  const { startUpload: startImageUpload } = useUploadThing("imageUploader")
  const { startUpload: startDocumentUpload } = useUploadThing("documentUploader")
  
  // Add Convex mutations
  const createService = useMutation(api.services.create)
  const createImpact = useMutation(api.impact.create)
  const createResource = useMutation(api.resources.create)
  const createSupport = useMutation(api.support.create)

  // Services state
  const [projectName, setProjectName] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [serviceImage, setServiceImage] = useState<File | null>(null)
  const [serviceImagePreview, setServiceImagePreview] = useState<string>('')

  // Impact state
  const [impactHeading, setImpactHeading] = useState('')
  const [impactDescription, setImpactDescription] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [impactImage, setImpactImage] = useState<File | null>(null)
  const [impactImagePreview, setImpactImagePreview] = useState<string>('')
  const [videoUrl, setVideoUrl] = useState('')

  // Resources state
  const [resourceName, setResourceName] = useState('')
  const [resourceDescription, setResourceDescription] = useState('')
  const [resourceType, setResourceType] = useState<'document' | 'link'>('document')
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [resourceUrl, setResourceUrl] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')

  // Support state
  const [supportName, setSupportName] = useState('')
  const [supportAge, setSupportAge] = useState('')
  const [supportLocation, setSupportLocation] = useState('')
  const [supportStory, setSupportStory] = useState('')
  const [supportImage, setSupportImage] = useState<File | null>(null)
  const [supportImagePreview, setSupportImagePreview] = useState<string>('')
  const [supportCategory, setSupportCategory] = useState<'mother' | 'child'>('mother')

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = Cookies.get('adminAuthenticated')
    if (!isAuthenticated) {
      router.replace('/admin/login')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const sidebarItems: SidebarItem[] = [
    { name: 'Services', path: '#' },
    { name: 'Impact', path: '#' },
    { name: 'Resources', path: '#' },
    { name: 'Support', path: '#' }
  ]

  const handleLogout = () => {
    Cookies.remove('adminAuthenticated')
    router.replace('/admin/login')
  }

  const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setServiceImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setServiceImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImpactImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImpactImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImpactImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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

  const handleSupportImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSupportImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSupportImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim() || !serviceDescription.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    
    setIsLoading(true)

    try {
      let imageUrl = undefined

      if (serviceImage) {
        try {
          const uploadResult = await startImageUpload([serviceImage])
          if (uploadResult && uploadResult[0]) {
            imageUrl = uploadResult[0].url
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Failed to upload image')
          setIsLoading(false)
          return
        }
      }

      await createService({
        projectName: projectName.trim(),
        description: serviceDescription.trim(),
        imageUrl,
      })

      // Show success message and reset form
      toast.success('Service created successfully!')
      setProjectName('')
      setServiceDescription('')
      setServiceImage(null)
      setServiceImagePreview('')

      // Wait for 1 second before refreshing
      setTimeout(() => {
        router.refresh()
      }, 1000)

    } catch (error) {
      console.error('Error creating service:', error)
      toast.error('Failed to create service. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImpactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!impactHeading.trim() || !impactDescription.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    if (mediaType === 'video' && !videoUrl.trim()) {
      toast.error('Please provide a video URL')
      return
    }
    
    setIsLoading(true)

    try {
      let mediaUrl = undefined

      if (mediaType === 'image' && impactImage) {
        try {
          const uploadResult = await startImageUpload([impactImage])
          if (uploadResult && uploadResult[0]) {
            mediaUrl = uploadResult[0].url
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Failed to upload image')
          setIsLoading(false)
          return
        }
      } else if (mediaType === 'video') {
        mediaUrl = videoUrl.trim()
      }

      await createImpact({
        heading: impactHeading.trim(),
        description: impactDescription.trim(),
        mediaType,
        mediaUrl,
      })

      // Show success message and reset form
      toast.success('Impact story created successfully!')
      setImpactHeading('')
      setImpactDescription('')
      setImpactImage(null)
      setImpactImagePreview('')
      setVideoUrl('')

      // Wait for 1 second before refreshing
      setTimeout(() => {
        router.refresh()
      }, 1000)

    } catch (error) {
      console.error('Error creating impact story:', error)
      toast.error('Failed to create impact story. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resourceName.trim() || !resourceDescription.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    if (resourceType === 'document' && !documentFile) {
      toast.error('Please upload a document')
      return
    }
    if (resourceType === 'link' && !resourceUrl.trim()) {
      toast.error('Please provide a resource URL')
      return
    }
    
    setIsLoading(true)

    try {
      let thumbnailUrl = undefined
      let documentUrl = undefined
      let finalResourceUrl = undefined

      if (thumbnailFile) {
        try {
          const thumbnailResult = await startImageUpload([thumbnailFile])
          if (thumbnailResult && thumbnailResult[0]) {
            thumbnailUrl = thumbnailResult[0].url
          }
        } catch (error) {
          console.error('Error uploading thumbnail:', error)
          toast.error('Failed to upload thumbnail')
          setIsLoading(false)
          return
        }
      }

      if (resourceType === 'document' && documentFile) {
        try {
          const documentResult = await startDocumentUpload([documentFile])
          if (documentResult && documentResult[0]) {
            documentUrl = documentResult[0].url
          }
        } catch (error) {
          console.error('Error uploading document:', error)
          toast.error('Failed to upload document')
          setIsLoading(false)
          return
        }
      } else if (resourceType === 'link') {
        finalResourceUrl = resourceUrl.trim()
      }

      await createResource({
        name: resourceName.trim(),
        description: resourceDescription.trim(),
        resourceType,
        resourceUrl: finalResourceUrl,
        documentUrl,
        thumbnailUrl,
      })

      // Show success message and reset form
      toast.success('Resource created successfully!')
      setResourceName('')
      setResourceDescription('')
      setDocumentFile(null)
      setResourceUrl('')
      setThumbnailFile(null)
      setThumbnailPreview('')

      // Wait for 1 second before refreshing
      setTimeout(() => {
        router.refresh()
      }, 1000)

    } catch (error) {
      console.error('Error creating resource:', error)
      toast.error('Failed to create resource. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supportName.trim() || !supportAge || !supportLocation.trim() || !supportStory.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    const ageNum = parseInt(supportAge)
    if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      toast.error('Please enter a valid age')
      return
    }
    
    setIsLoading(true)

    try {
      let imageUrl = undefined

      if (supportImage) {
        try {
          const uploadResult = await startImageUpload([supportImage])
          if (uploadResult && uploadResult[0]) {
            imageUrl = uploadResult[0].url
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Failed to upload image')
          setIsLoading(false)
          return
        }
      }

      await createSupport({
        category: supportCategory,
        name: supportName.trim(),
        age: parseInt(supportAge),
        location: supportLocation.trim(),
        story: supportStory.trim(),
        imageUrl,
      })

      // Show success message and reset form
      toast.success('Support case created successfully!')
      setSupportName('')
      setSupportAge('')
      setSupportLocation('')
      setSupportStory('')
      setSupportImage(null)
      setSupportImagePreview('')

      // Wait for 1 second before refreshing
      setTimeout(() => {
        router.refresh()
      }, 1000)

    } catch (error) {
      console.error('Error creating support case:', error)
      toast.error('Failed to create support case. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activePage) {
      case 'services':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Add New Service</h2>
            <form onSubmit={handleServiceSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    {serviceImagePreview ? (
                      <Image
                        src={serviceImagePreview}
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
                    onChange={handleServiceImageChange}
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter service description..."
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        )

      case 'impact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Add Impact Story</h2>
            <form onSubmit={handleImpactSubmit} className="space-y-6">
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
                      {impactImagePreview ? (
                        <Image
                          src={impactImagePreview}
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
                      onChange={handleImpactImageChange}
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
                  value={impactHeading}
                  onChange={(e) => setImpactHeading(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={impactDescription}
                  onChange={(e) => setImpactDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter impact description..."
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

      case 'resources':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Add Resource</h2>
            <form onSubmit={handleResourceSubmit} className="space-y-6">
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
                  value={resourceDescription}
                  onChange={(e) => setResourceDescription(e.target.value)}
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

      case 'support':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Add Support Case</h2>
            <form onSubmit={handleSupportSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="mother"
                      checked={supportCategory === 'mother'}
                      onChange={(e) => setSupportCategory(e.target.value as 'mother' | 'child')}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Mother</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="child"
                      checked={supportCategory === 'child'}
                      onChange={(e) => setSupportCategory(e.target.value as 'mother' | 'child')}
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
                    {supportImagePreview ? (
                      <Image
                        src={supportImagePreview}
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
                    onChange={handleSupportImageChange}
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
                  value={supportName}
                  onChange={(e) => setSupportName(e.target.value)}
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
                  value={supportAge}
                  onChange={(e) => setSupportAge(e.target.value)}
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
                  value={supportLocation}
                  onChange={(e) => setSupportLocation(e.target.value)}
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
                  value={supportStory}
                  onChange={(e) => setSupportStory(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter person's story..."
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Save Support Case
                </button>
              </div>
            </form>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          </div>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name.toLowerCase())}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors
                ${activePage === item.name.toLowerCase() ? 'bg-gray-100 border-l-4 border-blue-500' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
