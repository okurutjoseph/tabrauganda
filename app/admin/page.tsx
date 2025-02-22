'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Sidebar item type
type SidebarItem = {
  name: string
  path: string
  icon?: React.ReactNode
}

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState('services')
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('adminAuthenticated')
    if (!isAuthenticated) {
      router.push('/admin/login')
    }
  }, [router])

  const sidebarItems: SidebarItem[] = [
    { name: 'Services', path: '/admin/services' },
    { name: 'Impact', path: '/admin/impact' },
    { name: 'Support', path: '/admin/support' }
  ]

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    router.push('/admin/login')
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
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors
                ${activePage === item.name.toLowerCase() ? 'bg-gray-100 border-l-4 border-blue-500' : ''}`}
              onClick={() => setActivePage(item.name.toLowerCase())}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
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
      <div className="flex-1 p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-semibold mb-4">
            {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
          </h1>
          {/* Content for each section will be added here */}
          <p className="text-gray-600">Select a section from the sidebar to view its content.</p>
        </div>
      </div>
    </div>
  )
}
