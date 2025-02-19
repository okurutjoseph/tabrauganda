import Image from "next/image";
import Link from "next/link";
import MainHeader from '@/components/main-header'
import { gotham, lora } from './fonts'
import PrimaryLinkButton from '@/components/buttons/primary-link-button'
import SecondaryLinkButton from '@/components/buttons/secondary-link-button'

export default function Home() {
  return (
    <>
      <div className="relative">
        <MainHeader />
        {/* Hero Section */}
        <div className="relative h-screen">
          <Image
            src="/images/hero-image.png"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30">
            <div className="container mx-auto h-full flex items-center justify-center px-4">
              <div className="text-center pt-20">
                <h2 className="
                  text-[64px] 
                  font-extrabold 
                  text-white 
                  leading-[1em]
                  pb-[35px]
                  text-shadow-hero
                  font-gotham
                ">
                  PUTTING GOD'S LOVE IN ACTION AMONGEST COMMUNITIES
                </h2>
                <p className="
                  text-[17px] 
                  font-normal 
                  text-white 
                  leading-[1.5]
                  text-shadow-hero
                  text-center
                  max-w-[720px]
                  mx-auto
                  mb-8
                  font-gotham
                ">
                  Thy Kingdom Come
                </p>
                <div className="flex gap-4 justify-center">
                  <PrimaryLinkButton href="/sponsor" className="mt-0">
                    SPONSOR
                  </PrimaryLinkButton>
                  <SecondaryLinkButton href="/donate" className="mt-0">
                    DONATE
                  </SecondaryLinkButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group">
              <div className="relative h-[300px] mb-4">
                <Image
                  src="/images/card1.jpg"
                  alt="Living Hope"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-2 font-gotham">LIVING HOPE</h2>
              <h4 className="mb-4 font-lora">Bringing hope to vulnerable women in Uganda</h4>
              <Link 
                href="/programs/living-hope"
                className="text-[#008c15] font-bold hover:underline font-gotham"
              >
                READ MORE
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group">
              <div className="relative h-[300px] mb-4">
                <Image
                  src="/images/card2.jpg"
                  alt="Watoto Children"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-2 font-gotham">WATOTO CHILDREN</h2>
              <h4 className="mb-4 font-lora">Rescuing and raising future leaders</h4>
              <Link 
                href="/programs/children"
                className="text-[#008c15] font-bold hover:underline font-gotham"
              >
                READ MORE
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group">
              <div className="relative h-[300px] mb-4">
                <Image
                  src="/images/card3.jpg"
                  alt="Watoto Church"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-2 font-gotham">WATOTO CHURCH</h2>
              <h4 className="mb-4 font-lora">Building a family of Christ in the heart of Africa</h4>
              <Link 
                href="/church"
                className="text-[#008c15] font-bold hover:underline font-gotham"
              >
                READ MORE
              </Link>
            </div>

            {/* Card 4 */}
            <div className="group">
              <div className="relative h-[300px] mb-4">
                <Image
                  src="/images/card4.jpg"
                  alt="Baby Watoto"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-2 font-gotham">BABY WATOTO</h2>
              <h4 className="mb-4 font-lora">Nurturing abandoned babies into healthy toddlers</h4>
              <Link 
                href="/programs/baby-watoto"
                className="text-[#008c15] font-bold hover:underline font-gotham"
              >
                READ MORE
              </Link>
            </div>

            {/* Card 5 */}
            <div className="group">
              <div className="relative h-[300px] mb-4">
                <Image
                  src="/images/card5.jpg"
                  alt="Neighborhood"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-2 font-gotham">NEIGHBORHOOD</h2>
              <h4 className="mb-4 font-lora">Transforming communities through local outreach</h4>
              <Link 
                href="/programs/neighborhood"
                className="text-[#008c15] font-bold hover:underline font-gotham"
              >
                READ MORE
              </Link>
            </div>

            {/* Card 6 */}
            <div className="group">
              <div className="relative h-[300px] mb-4">
                <Image
                  src="/images/card6.jpg"
                  alt="Target 2030"
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-xl font-bold mb-2 font-gotham">TARGET 2030</h2>
              <h4 className="mb-4 font-lora">Building a bright future for Africa</h4>
              <Link 
                href="/programs/target-2030"
                className="text-[#008c15] font-bold hover:underline font-gotham"
              >
                READ MORE
              </Link>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="bg-gray-100 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-8 font-gotham">JOIN US AS WE HELP TRANSFORM AFRICA</h2>
            <div className="flex gap-4 justify-center flex-wrap">
              <Image
                src="/images/gallery1.jpg"
                alt="Gallery image 1"
                width={120}
                height={120}
                className="rounded"
              />
              <Image
                src="/images/gallery2.jpg"
                alt="Gallery image 2"
                width={120}
                height={120}
                className="rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
