'use client'

import { useCallback, useState } from 'react'
import { DecorativeLogo } from './DecorativeLogo'
import { Sticky } from './Sticky'

type HeroSectionProps = {
  headline: string
  subheadline: string
}

export const HeroSection = ({ headline, subheadline }: HeroSectionProps) => {
  const [isLogoSticky, setIsLogoSticky] = useState(false)
  const [isSubheadlineSticky, setIsSubheadlineSticky] = useState(false)

  const isExpanded = isLogoSticky && isSubheadlineSticky

  const handleLogoStickyChange = useCallback((sticky: boolean) => setIsLogoSticky(sticky), [])
  const handleSubheadlineStickyChange = useCallback(
    (sticky: boolean) => setIsSubheadlineSticky(sticky),
    [],
  )

  return (
    <>
      {/* Fixed backdrop for sticky elements - below hero (z-50) but above other sections */}
      <div
        className='fixed top-0 left-0 right-0 h-[120px] bg-[#770B1B] z-10'
        style={{ boxShadow: '0 4px 12px 0 #770B1B' }}
      />

      <section id='hero' className='pt-16 px-20 bg-[#770B1B] relative z-20'>
        <div className='max-w-[1280px] mx-auto grid grid-cols-[1fr_auto] gap-y-5'>
          <h1 className='text-[48px] font-normal italic leading-none text-[#F1EDE4] max-w-[612px]'>
            {headline}
          </h1>

          <div className='row-span-2'>
            <Sticky topOffset={24} onStickyChange={handleLogoStickyChange}>
              <DecorativeLogo className='w-[118px] h-[72px]' isExpanded={isExpanded} />
            </Sticky>
          </div>

          <Sticky topOffset={48} onStickyChange={handleSubheadlineStickyChange}>
            <p className='text-[24px] font-light italic text-[#AE8237] max-w-[663px]'>
              {subheadline}
            </p>
          </Sticky>
        </div>
      </section>
    </>
  )
}
