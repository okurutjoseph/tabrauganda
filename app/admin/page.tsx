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

  // Only need imageUploader now
  const { startUpload: startImageUpload } = useUploadThing("imageUploader")
  
  // Add Convex mutations
  const createService = useMutation(api.services.create)
  const createImpact = useMutation(api.impact.create)
  const createSupport = useMutation(api.support.create)
  const updateService = useMutation(api.services.update)
  const updateSupport = useMutation(api.support.update)
  const updateImpact = useMutation(api.impact.update)

  // Add file tracking state
  const [uploadedFileKeys, setUploadedFileKeys] = useState<string[]>([])

  // Services state
  const [projectName, setProjectName] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [serviceImage, setServiceImage] = useState<File | null>(null)
  const [serviceImagePreview, setServiceImagePreview] = useState<string>('')

  // Impact state
  const [impactHeading, setImpactHeading] = useState('')
  const [impactDescription, setImpactDescription] = useState('')
  const [impactImage, setImpactImage] = useState<File | null>(null)
  const [impactImagePreview, setImpactImagePreview] = useState<string>('')

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
  const [editingServiceId, setEditingServiceId] = useState<Id<"services"> | null>(null)
  const [editingImpactId, setEditingImpactId] = useState<Id<"impact"> | null>(null)
  const [editingSupportId, setSupportEditingId] = useState<Id<"support"> | null>(null)

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

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = Cookies.get('adminAuthenticated')
    if (!isAuthenticated) {
      router.replace('/admin/login')
      return
    }
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    Cookies.remove('adminAuthenticated')
    router.replace('/admin/login')
  }

  // Add image handlers with file tracking
  const handleServiceImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setServiceImage(file)
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

  // Helper function to handle image upload and tracking
  const handleImageUpload = async (file: File) => {
    try {
      const uploadRes = await startImageUpload([file])
      if (uploadRes?.[0]) {
        // Store the file key for tracking
        const fileKey = uploadRes[0].key
        setUploadedFileKeys(prev => [...prev, fileKey])
        return uploadRes[0].url
      }
      return ''
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image')
      return ''
    }
  }

  // Add edit handlers with file tracking
  const handleServiceEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingServiceId) return

    try {
      let imageUrl = serviceImagePreview
      if (serviceImage) {
        imageUrl = await handleImageUpload(serviceImage)
      }
      
      await updateService({
        id: editingServiceId,
        projectName,
        description: serviceDescription,
        imageUrl,
      })
      
      // Reset form and editing state
      setEditingServiceId(null)
      setProjectName('')
      setServiceDescription('')
      setServiceImage(null)
      setServiceImagePreview('')
      toast.success('Service updated successfully!')
    } catch (error) {
      console.error('Error updating service:', error)
      toast.error('Failed to update service')
    }
  }

  const handleImpactEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingImpactId) return

    try {
      let imageUrl = impactImagePreview
      if (impactImage) {
        imageUrl = await handleImageUpload(impactImage)
      }
      
      await updateImpact({
        id: editingImpactId,
        heading: impactHeading,
        description: impactDescription,
        imageUrl,
      })
      
      // Reset form and editing state
      setEditingImpactId(null)
      setImpactHeading('')
      setImpactDescription('')
      setImpactImage(null)
      setImpactImagePreview('')
      toast.success('Impact story updated successfully!')
    } catch (error) {
      console.error('Error updating impact story:', error)
      toast.error('Failed to update impact story')
    }
  }

  const handleSupportEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingSupportId) return

    try {
      let imageUrl = supportImagePreview
      if (supportImage) {
        imageUrl = await handleImageUpload(supportImage)
      }
      
      await updateSupport({
        id: editingSupportId,
        name: supportName,
        age: parseInt(supportAge),
        location: supportLocation,
        story: supportStory,
        category: supportCategory,
        imageUrl,
      })
      
      // Reset form and editing state
      setSupportEditingId(null)
      setSupportName('')
      setSupportAge('')
      setSupportLocation('')
      setSupportStory('')
      setSupportCategory('mother')
      setSupportImage(null)
      setSupportImagePreview('')
      toast.success('Support case updated successfully!')
    } catch (error) {
      console.error('Error updating support case:', error)
      toast.error('Failed to update support case')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <div className="text-xl text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="p-4">
          {sidebarItems.map((item) => (
            <div key={item.name} className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
              <div className="space-y-1">
                {item.subItems.map((subItem) => (
                  <button
                    key={subItem.action}
                    onClick={() => setActivePage({ main: item.name.toLowerCase(), sub: subItem.action })}
                    className={`block w-full text-left px-3 py-2 rounded-md text-sm ${
                      activePage.main === item.name.toLowerCase() && activePage.sub === subItem.action
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {subItem.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={handleLogout}
            className="mt-8 w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Services Section */}
          {activePage.main === 'services' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {activePage.sub === 'add' ? 'Add New Service' : editingServiceId ? 'Edit Service' : 'Edit Services'}
              </h2>
              
              {activePage.sub === 'add' ? (
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    let imageUrl = ''
                    if (serviceImage) {
                      imageUrl = await handleImageUpload(serviceImage)
                    }
                    
                    await createService({
                      projectName,
                      description: serviceDescription,
                      imageUrl,
                    })
                    
                    // Reset form
                    setProjectName('')
                    setServiceDescription('')
                    setServiceImage(null)
                    setServiceImagePreview('')
                    toast.success('Service created successfully!')
                  } catch (error) {
                    console.error('Error creating service:', error)
                    toast.error('Failed to create service')
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleServiceImageChange}
                      className="mt-1 block w-full"
                    />
                    {serviceImagePreview && (
                      <img
                        src={serviceImagePreview}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Create Service
                  </button>
                </form>
              ) : editingServiceId ? (
                <form onSubmit={handleServiceEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleServiceImageChange}
                      className="mt-1 block w-full"
                    />
                    {serviceImagePreview && (
                      <img
                        src={serviceImagePreview}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Update Service
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingServiceId(null)
                        setProjectName('')
                        setServiceDescription('')
                        setServiceImage(null)
                        setServiceImagePreview('')
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {services?.map((service) => (
                    <div key={service._id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{service.projectName}</h3>
                          <p className="text-gray-600">{service.description}</p>
                          {service.imageUrl && (
                            <div className="mt-2">
                              <img src={service.imageUrl} alt={service.projectName} className="h-32 w-32 object-cover rounded-md" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setEditingServiceId(service._id)
                            setProjectName(service.projectName)
                            setServiceDescription(service.description)
                            if (service.imageUrl) setServiceImagePreview(service.imageUrl)
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Impact Section */}
          {activePage.main === 'impact' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {activePage.sub === 'add' ? 'Add New Impact Story' : editingImpactId ? 'Edit Impact Story' : 'Edit Impact Stories'}
              </h2>
              
              {activePage.sub === 'add' ? (
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    let imageUrl = ''
                    if (impactImage) {
                      imageUrl = await handleImageUpload(impactImage)
                    }
                    
                    await createImpact({
                      heading: impactHeading,
                      description: impactDescription,
                      imageUrl,
                    })
                    
                    // Reset form
                    setImpactHeading('')
                    setImpactDescription('')
                    setImpactImage(null)
                    setImpactImagePreview('')
                    toast.success('Impact story created successfully!')
                  } catch (error) {
                    console.error('Error creating impact story:', error)
                    toast.error('Failed to create impact story')
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Heading</label>
                    <input
                      type="text"
                      value={impactHeading}
                      onChange={(e) => setImpactHeading(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={impactDescription}
                      onChange={(e) => setImpactDescription(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImpactImageChange}
                      className="mt-1 block w-full"
                    />
                    {impactImagePreview && (
                      <img
                        src={impactImagePreview}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Create Impact Story
                  </button>
                </form>
              ) : editingImpactId ? (
                <form onSubmit={handleImpactEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Heading</label>
                    <input
                      type="text"
                      value={impactHeading}
                      onChange={(e) => setImpactHeading(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={impactDescription}
                      onChange={(e) => setImpactDescription(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImpactImageChange}
                      className="mt-1 block w-full"
                    />
                    {impactImagePreview && (
                      <img
                        src={impactImagePreview}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Update Impact Story
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingImpactId(null)
                        setImpactHeading('')
                        setImpactDescription('')
                        setImpactImage(null)
                        setImpactImagePreview('')
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {impactStories?.map((story) => story && (
                    <div key={story._id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{story.heading}</h3>
                          <p className="text-gray-600">{story.description}</p>
                          {story.imageUrl && (
                            <div className="mt-2">
                              <img src={story.imageUrl} alt={story.heading} className="h-32 w-32 object-cover rounded-md" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setEditingImpactId(story._id)
                            setImpactHeading(story.heading)
                            setImpactDescription(story.description)
                            if (story.imageUrl) setImpactImagePreview(story.imageUrl)
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Support Section */}
          {activePage.main === 'support' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {activePage.sub === 'add' ? 'Add New Support Case' : editingSupportId ? 'Edit Support Case' : 'Edit Support Cases'}
              </h2>
              
              {activePage.sub === 'add' ? (
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    let imageUrl = ''
                    if (supportImage) {
                      imageUrl = await handleImageUpload(supportImage)
                    }
                    
                    await createSupport({
                      name: supportName,
                      age: parseInt(supportAge),
                      location: supportLocation,
                      story: supportStory,
                      category: supportCategory,
                      imageUrl,
                    })
                    
                    // Reset form
                    setSupportName('')
                    setSupportAge('')
                    setSupportLocation('')
                    setSupportStory('')
                    setSupportCategory('mother')
                    setSupportImage(null)
                    setSupportImagePreview('')
                    toast.success('Support case created successfully!')
                  } catch (error) {
                    console.error('Error creating support case:', error)
                    toast.error('Failed to create support case')
                  }
                }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value as 'mother' | 'child')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="mother">Mother</option>
                      <option value="child">Child</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={supportAge}
                      onChange={(e) => setSupportAge(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={supportLocation}
                      onChange={(e) => setSupportLocation(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Story</label>
                    <textarea
                      value={supportStory}
                      onChange={(e) => setSupportStory(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSupportImageChange}
                      className="mt-1 block w-full"
                    />
                    {supportImagePreview && (
                      <img
                        src={supportImagePreview}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Create Support Case
                  </button>
                </form>
              ) : editingSupportId ? (
                <form onSubmit={handleSupportEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value as 'mother' | 'child')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="mother">Mother</option>
                      <option value="child">Child</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      value={supportAge}
                      onChange={(e) => setSupportAge(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={supportLocation}
                      onChange={(e) => setSupportLocation(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Story</label>
                    <textarea
                      value={supportStory}
                      onChange={(e) => setSupportStory(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSupportImageChange}
                      className="mt-1 block w-full"
                    />
                    {supportImagePreview && (
                      <img
                        src={supportImagePreview}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Update Support Case
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSupportEditingId(null)
                        setSupportName('')
                        setSupportAge('')
                        setSupportLocation('')
                        setSupportStory('')
                        setSupportCategory('mother')
                        setSupportImage(null)
                        setSupportImagePreview('')
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  {supportCases?.map((supportCase) => supportCase && (
                    <div key={supportCase._id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium">{supportCase.name}</h3>
                          <p className="text-gray-600">Category: {supportCase.category}</p>
                          <p className="text-gray-600">Age: {supportCase.age}</p>
                          <p className="text-gray-600">Location: {supportCase.location}</p>
                          <p className="text-gray-600">{supportCase.story}</p>
                          {supportCase.imageUrl && (
                            <div className="mt-2">
                              <img src={supportCase.imageUrl} alt={supportCase.name} className="h-32 w-32 object-cover rounded-md" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setSupportEditingId(supportCase._id)
                            setSupportName(supportCase.name)
                            setSupportAge(supportCase.age.toString())
                            setSupportLocation(supportCase.location)
                            setSupportStory(supportCase.story)
                            setSupportCategory(supportCase.category as 'mother' | 'child')
                            if (supportCase.imageUrl) setSupportImagePreview(supportCase.imageUrl)
                          }}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
