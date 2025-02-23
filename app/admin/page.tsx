'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Cookies from 'js-cookie'
import { useUploadThing } from '@/lib/uploadthing'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { toast } from 'sonner'
import { Id } from '@/convex/_generated/dataModel'

// Sidebar item type
type SidebarItem = {
  name: string
  subItems: Array<{
    name: string
    action: string
  }>
}

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState<{main: string, sub: string}>({
    main: 'services',
    sub: 'add'
  })
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Add UploadThing hooks
  const { startUpload: startImageUpload } = useUploadThing("imageUploader")
  const { startUpload: startDocumentUpload } = useUploadThing("documentUploader")
  
  // Add Convex mutations
  const createService = useMutation(api.services.create)
  const createImpact = useMutation(api.impact.create)
  const createSupport = useMutation(api.support.create)
  const updateService = useMutation(api.services.update)
  const updateSupport = useMutation(api.support.update)
  const updateImpact = useMutation(api.impact.update)

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

  // Support state
  const [supportName, setSupportName] = useState('')
  const [supportAge, setSupportAge] = useState('')
  const [supportLocation, setSupportLocation] = useState('')
  const [supportStory, setSupportStory] = useState('')
  const [supportImage, setSupportImage] = useState<File | null>(null)
  const [supportImagePreview, setSupportImagePreview] = useState<string>('')
  const [supportCategory, setSupportCategory] = useState<'mother' | 'child'>('mother')

  // Add queries for all data
  const services = useQuery(api.services.getAll)
  const impactStories = useQuery(api.impact.getAll)
  const supportCases = useQuery(api.support.getAll)

  // Add these states for editing
  const [editingId, setEditingId] = useState<Id<"services"> | Id<"support"> | Id<"impact"> | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = Cookies.get('adminAuthenticated')
    if (!isAuthenticated) {
      router.replace('/admin/login')
      return
    }
    
    setIsLoading(false)
  }, [router])

  const sidebarItems: SidebarItem[] = [
    { 
      name: 'Services',
      subItems: [
        { name: 'Add New Service', action: 'add' },
        { name: 'Edit Services', action: 'edit' }
      ]
    },
    { 
      name: 'Impact',
      subItems: [
        { name: 'Add New Story', action: 'add' },
        { name: 'Edit Stories', action: 'edit' }
      ]
    },
    { 
      name: 'Support',
      subItems: [
        { name: 'Add New Case', action: 'add' },
        { name: 'Edit Cases', action: 'edit' }
      ]
    }
  ]

  const handleLogout = () => {
    Cookies.remove('adminAuthenticated')
    router.replace('/admin/login')
  }

  const handleServiceImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setServiceImage(file)
        // Show preview
        const reader = new FileReader()
        reader.onloadend = () => {
          setServiceImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error handling image:', error)
        toast.error('Failed to process image')
      }
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

    try {
      setIsLoading(true)
      let imageUrl = undefined

      if (serviceImage) {
        try {
          console.log("Starting image upload...")
          const uploadResult = await startImageUpload([serviceImage])
          console.log("Upload result:", uploadResult)
          if (uploadResult && uploadResult[0]) {
            imageUrl = uploadResult[0].url
            console.log("Image URL:", imageUrl)
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          toast.error('Failed to upload image')
          setIsLoading(false)
          return
        }
      }

      if (editingId) {
        await updateService({
          id: editingId as Id<"services">,
          projectName: projectName.trim(),
          description: serviceDescription.trim(),
          imageUrl: imageUrl || serviceImagePreview || undefined,
        })
        toast.success('Service updated successfully!')
        setEditingId(null)
      } else {
        await createService({
          projectName: projectName.trim(),
          description: serviceDescription.trim(),
          imageUrl,
        })
        toast.success('Service created successfully!')
      }

      // Reset form
      setProjectName('')
      setServiceDescription('')
      setServiceImage(null)
      setServiceImagePreview('')
      setIsLoading(false)

    } catch (error) {
      console.error('Error with service:', error)
      toast.error(editingId ? 'Failed to update service' : 'Failed to create service')
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

    try {
      setIsLoading(true)
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

      if (editingId && typeof editingId === 'string') {
        await updateImpact({
          id: editingId as Id<"impact">,
          heading: impactHeading.trim(),
          description: impactDescription.trim(),
          mediaType,
          mediaUrl: mediaUrl || impactImagePreview || undefined,
        })
        toast.success('Story updated successfully!')
        setEditingId(null)
      } else {
        await createImpact({
          heading: impactHeading.trim(),
          description: impactDescription.trim(),
          mediaType,
          mediaUrl,
        })
        toast.success('Story created successfully!')
      }

      // Reset form
      setImpactHeading('')
      setImpactDescription('')
      setMediaType('image')
      setImpactImage(null)
      setImpactImagePreview('')
      setVideoUrl('')
      setIsLoading(false)

    } catch (error) {
      console.error('Error with impact story:', error)
      toast.error(editingId ? 'Failed to update story' : 'Failed to create story')
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

    try {
      setIsLoading(true)
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

      if (editingId && typeof editingId === 'string') {
        await updateSupport({
          id: editingId as Id<"support">,
          category: supportCategory,
          name: supportName.trim(),
          age: parseInt(supportAge),
          location: supportLocation.trim(),
          story: supportStory.trim(),
          imageUrl: imageUrl || supportImagePreview || undefined,
        })
        toast.success('Support case updated successfully!')
        setEditingId(null)
      } else {
        await createSupport({
          category: supportCategory,
          name: supportName.trim(),
          age: parseInt(supportAge),
          location: supportLocation.trim(),
          story: supportStory.trim(),
          imageUrl,
        })
        toast.success('Support case created successfully!')
      }

      // Reset form
      setSupportName('')
      setSupportAge('')
      setSupportLocation('')
      setSupportStory('')
      setSupportImage(null)
      setSupportImagePreview('')
      setIsLoading(false)

    } catch (error) {
      console.error('Error with support case:', error)
      toast.error(editingId ? 'Failed to update support case' : 'Failed to create support case')
      setIsLoading(false)
    }
  }

  // Add edit handlers
  const handleEditService = (service: any) => {
    setEditingId(service._id)
    setProjectName(service.projectName)
    setServiceDescription(service.description)
    setServiceImagePreview(service.imageUrl || '')
    setActivePage({
      main: 'services',
      sub: 'edit'
    })
  }

  const handleEditSupport = (supportCase: any) => {
    if (!supportCase._id) return;
    
    setEditingId(supportCase._id as Id<"support">)
    setSupportName(supportCase.name)
    setSupportAge(supportCase.age.toString())
    setSupportLocation(supportCase.location)
    setSupportStory(supportCase.story)
    setSupportCategory(supportCase.category)
    setSupportImagePreview(supportCase.imageUrl || '')
    setActivePage({
      main: 'support',
      sub: 'edit'
    })
  }

  const handleEditImpact = (story: any) => {
    if (!story._id) return;
    
    setEditingId(story._id as Id<"impact">)
    setImpactHeading(story.heading)
    setImpactDescription(story.description)
    setMediaType(story.mediaType)
    if (story.mediaType === 'video') {
      setVideoUrl(story.mediaUrl || '')
    } else {
      setImpactImagePreview(story.mediaUrl || '')
    }
    setActivePage({
      main: 'impact',
      sub: 'edit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <div className="text-xl text-gray-600">Processing...</div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (`${activePage.main}-${activePage.sub}`) {
      case 'services-add':
        return (
          <div className="space-y-8">
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

      case 'services-edit':
        if (editingId) {
          // Show edit form
          return (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Edit Service</h2>
                <button
                  onClick={() => {
                    setEditingId(null)
                    setProjectName('')
                    setServiceDescription('')
                    setServiceImage(null)
                    setServiceImagePreview('')
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel Edit
                </button>
              </div>
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
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Update Service
                  </button>
                </div>
              </form>
            </div>
          )
        }

        // Show list of services
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Edit Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services?.map((service) => (
                <div key={service._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">{service.projectName}</h3>
                    <button
                      onClick={() => handleEditService(service)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </div>
                  {service.imageUrl && (
                    <div className="relative h-40 mb-4">
                      <Image
                        src={service.imageUrl}
                        alt={service.projectName}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'impact-add':
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

      case 'support-add':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Add New Support Case</h2>
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

      case 'support-edit':
        if (editingId) {
          // Show edit form
          return (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Edit Support Case</h2>
                <button
                  onClick={() => {
                    setEditingId(null)
                    setSupportName('')
                    setSupportAge('')
                    setSupportLocation('')
                    setSupportStory('')
                    setSupportImage(null)
                    setSupportImagePreview('')
                    setSupportCategory('mother')
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel Edit
                </button>
              </div>
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
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Update Support Case
                  </button>
                </div>
              </form>
            </div>
          )
        }

        // Show list of support cases
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Edit Support Cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {supportCases?.map((supportCase) => (
                <div key={supportCase._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-medium">{supportCase.name}</h3>
                      <span className="text-sm text-gray-500">
                        {supportCase.category} • Age: {supportCase.age}
                      </span>
                    </div>
                    <button
                      onClick={() => handleEditSupport(supportCase)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </div>
                  {supportCase.imageUrl && (
                    <div className="relative h-40 mb-4">
                      <Image
                        src={supportCase.imageUrl}
                        alt={supportCase.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mb-2">Location: {supportCase.location}</p>
                  <p className="text-gray-600">{supportCase.story}</p>
                </div>
              ))}
            </div>
          </div>
        )

      case 'impact-edit':
        if (editingId) {
          return (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Edit Impact Story</h2>
                <button
                  onClick={() => {
                    setEditingId(null)
                    setImpactHeading('')
                    setImpactDescription('')
                    setMediaType('image')
                    setImpactImage(null)
                    setImpactImagePreview('')
                    setVideoUrl('')
                  }}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel Edit
                </button>
              </div>
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
                    Update Story
                  </button>
                </div>
              </form>
            </div>
          )
        }

        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Edit Impact Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {impactStories?.map((story) => (
                <div key={story._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-medium">{story.heading}</h3>
                    <button
                      onClick={() => handleEditImpact(story)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </div>
                  {story.mediaUrl && story.mediaType === 'image' && (
                    <div className="relative h-40 mb-4">
                      <Image
                        src={story.mediaUrl}
                        alt={story.heading}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  {story.mediaUrl && story.mediaType === 'video' && (
                    <div className="mb-4">
                      <iframe
                        src={story.mediaUrl}
                        className="w-full aspect-video rounded"
                        allowFullScreen
                      />
                    </div>
                  )}
                  <p className="text-gray-600">{story.description}</p>
                </div>
              ))}
            </div>
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
            <div key={item.name} className="mb-2">
              <div className="px-6 py-2 text-sm font-medium text-gray-600">
                {item.name}
              </div>
              {item.subItems.map((subItem) => (
                <button
                  key={subItem.name}
                  onClick={() => setActivePage({
                    main: item.name.toLowerCase(),
                    sub: subItem.action
                  })}
                  className={`w-full flex items-center px-8 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors
                    ${activePage.main === item.name.toLowerCase() && activePage.sub === subItem.action
                      ? 'bg-gray-100 border-l-4 border-blue-500'
                      : ''}`}
                >
                  <span>{subItem.name}</span>
                </button>
              ))}
            </div>
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
