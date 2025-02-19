import SecondaryHeader from '@/components/secondary-header'
import Link from 'next/link'
import PrimaryButton from '@/components/buttons/primary-button'

export default function ContactPage() {
  return (
    <>
      <SecondaryHeader title="Contact Us" />
      
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-3xl font-bold mb-8">CONTACT US</h1>
        
        <p className="mb-8 text-gray-700">
        Tabra as established in 2018, with the ultimate of reaching out to transform lives of the vulnerable children, women, elderly & disabled persons in various communities in Uganda.Working towards a future where all vulnerable children get the care and support they need to become better & responsible citizens in the communities they live through provision of education, healthcare, food & nutrition, sanitary pads for teenage girls and a long with clothing etc.
        </p>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">HEAD OFFICE</h2>
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 mt-1 rounded-full bg-[#008c15]" />
            <div>
              <h3 className="font-bold">TABRA UGANDA</h3>
              <p>+256 705 931 352</p>
              <p className="text-[#008c15]">INFO@TABRAUGANDA.ORG</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">SUPPORT OFFICES</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 mt-1 rounded-full bg-[#008c15]" />
              <div>
                <h3 className="font-bold">BUIKWE UGANDA</h3>
                <p>+256 775 973 101</p>
                <p className="text-[#008c15]">CONTACT@TABRAUGANDA.ORG</p>
              </div>
            </div>

          </div>
        </div>

        <p className="text-gray-700 mb-8">
          If you'd like to get in touch with our Support Offices, or click below to share your contact information and we'd be happy to get back to you.
        </p>

        <Link href="/contact/form">
          <PrimaryButton>
            CONTACT US
          </PrimaryButton>
        </Link>
      </div>
    </>
  )
}
