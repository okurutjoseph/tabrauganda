'use client'

import { useState } from 'react'
import SecondaryHeader from '@/components/secondary-header'

type FormErrors = {
  [key: string]: string
}

export default function ContactFormPage() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Add your form submission logic here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      alert('Message sent successfully!')
      e.currentTarget.reset()
    } catch (error) {
      setErrors({ submit: 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <SecondaryHeader title="LET'S STAY IN TOUCH" />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-center mb-8">
            We value every partner & would love the opportunity to connect with you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white p-6 rounded shadow-sm">
              <h2 className="font-bold mb-6">CONTACT INFORMATION</h2>
              
              <div className="mb-4">
                <input
                  type="checkbox"
                  id="isOrganization"
                  className="mr-2"
                />
                <label htmlFor="isOrganization">
                  This is an organization or group
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label htmlFor="confirmEmail" className="block mb-1">
                    Confirm Email Address*
                  </label>
                  <input
                    type="email"
                    id="confirmEmail"
                    name="confirmEmail"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded shadow-sm">
              <h2 className="font-bold mb-6">ADDITIONAL NOTES</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="hearAbout" className="block mb-1">
                    How did you hear about Watoto?
                  </label>
                  <textarea
                    id="hearAbout"
                    name="hearAbout"
                    rows={3}
                    className="w-full p-2 border rounded"
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="comments" className="block mb-1">
                    Additional Notes or Comments
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    rows={3}
                    className="w-full p-2 border rounded"
                  ></textarea>
                </div>

                <div>
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    className="mr-2"
                  />
                  <label htmlFor="newsletter">
                    Sign up to receive updates from Watoto
                  </label>
                </div>
              </div>
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-[#008c15] text-white px-8 py-2 rounded transition-colors ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-[#006b10]'
                }`}
              >
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
} 