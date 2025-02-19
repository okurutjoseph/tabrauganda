import SecondaryHeader from '@/components/secondary-header'
import SecondaryButton from '@/components/buttons/secondary-button'

export default function DonatePage() {
  return (
    <>
      <SecondaryHeader title="Donate" />
      <main className="min-h-screen bg-[#f3f0ea]">
        <div className="container mx-auto py-8">
          <div className="bg-white pt-[8%] pb-[15px]">
            <h1 className="text-[42px] font-normal text-[#010101] container mx-auto">BE A <strong>HERO</strong>, MAKE A <strong>DIFFERENCE</strong>.</h1>
          </div>

          <form className="space-y-8 py-[3.75rem] max-w-2xl mx-auto">
            {/* Donation Amount Section */}
            <div className="bg-white pt-[2.875rem] pb-[3.5rem] px-[2.5rem] border-b-[5px] border-[#008c15]">
              <h2 className="font-semibold mb-4">Donate to Tabra Uganda</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input 
                    type="number" 
                    placeholder="Other" 
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                <p>Payment Information Text</p>
                <p className="mt-2">Please note: All donations are in USD. Your credit card company will automatically convert your donation to your local currency.</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white pt-[2.875rem] pb-[3.5rem] px-[2.5rem]">
              <h2 className="text-center text-[#008c15] text-[1.625rem] font-bold mb-[1.75rem] leading-[1.2]">CONTACT INFORMATION</h2>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="First Name" 
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input 
                  type="text" 
                  placeholder="Last Name" 
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full p-2 border border-gray-300 rounded col-span-2"
                />
              </div>
            </div>

            {/* Mailing Address */}
            <div className="bg-white pt-[2.875rem] pb-[3.5rem] px-[2.5rem]">
              <h2 className="text-center text-[#008c15] text-[1.625rem] font-bold mb-[1.75rem] leading-[1.2]">MAILING ADDRESS</h2>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Address 1" 
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input 
                  type="text" 
                  placeholder="Address 2" 
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="City" 
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <input 
                    type="text" 
                    placeholder="State/Province" 
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="ZIP/Postal Code" 
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <select className="w-full p-2 border border-gray-300 rounded">
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="bg-white pt-[2.875rem] pb-[3.5rem] px-[2.5rem]">
              <h2 className="text-center text-[#008c15] text-[1.625rem] font-bold mb-[1.75rem] leading-[1.2]">ADDITIONAL NOTES</h2>
              <textarea 
                placeholder="How did you hear about us?" 
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <SecondaryButton type="submit">
                SUBMIT
              </SecondaryButton>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
