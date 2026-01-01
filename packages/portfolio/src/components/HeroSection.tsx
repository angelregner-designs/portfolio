'use client'

import { cn } from '@angel-portfolio/shared'
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
        className={cn('fixed top-0 left-0 right-0 z-10', 'h-[120px]', 'bg-oathfire')}
        style={{ boxShadow: '0 4px 12px 0 var(--color-oathfire)' }}
      />

      <section
        id='hero'
        className={cn('relative z-20', 'pt-16 pb-10 px-10 desktop:px-20', 'bg-oathfire')}
      >
        <div className='max-w-[1280px] mx-auto grid grid-cols-[1fr_auto] gap-y-5'>
          <h1
            className={cn(
              'max-w-full desktop:max-w-[612px]',
              'text-[40px] desktop:text-[48px] font-normal italic leading-none text-moon-paper',
            )}
          >
            {headline}
          </h1>

          <div className='row-span-2'>
            <Sticky topOffset={24} onStickyChange={handleLogoStickyChange}>
              <DecorativeLogo className='w-[118px] h-[72px]' isExpanded={isExpanded} />
            </Sticky>
          </div>

          <Sticky topOffset={40} onStickyChange={handleSubheadlineStickyChange}>
            <p
              className={cn(
                'max-w-full desktop:max-w-[663px]',
                'text-[24px] font-light italic text-golden-sol',
              )}
            >
              {subheadline}
            </p>
          </Sticky>
        </div>
      </section>
    </>
  )
}
