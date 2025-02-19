import React from 'react'

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#008c15]"></div>
    </div>
  )
} 