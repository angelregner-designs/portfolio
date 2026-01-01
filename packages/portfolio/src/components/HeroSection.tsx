'use client'

import { cn } from '@angel-portfolio/shared'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DecorativeLogo } from './DecorativeLogo'
import { HamburgerIcon } from './HamburgerIcon'
import { MobileNav } from './MobileNav'
import { Sticky } from './Sticky'

type HeroSectionProps = {
  headline: string
  subheadline: string
  nav: {
    projects: string
    testimonials: string
    about: string
  }
  ctaText: string
}

export const HeroSection = ({ headline, subheadline, nav, ctaText }: HeroSectionProps) => {
  const [isLogoSticky, setIsLogoSticky] = useState(false)
  const [isSubheadlineSticky, setIsSubheadlineSticky] = useState(false)
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)
  const [isTabletExpanded, setIsTabletExpanded] = useState(false)
  const [isNavOpen, setIsNavOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const isExpanded = isLogoSticky && isSubheadlineSticky

  const handleLogoStickyChange = useCallback((sticky: boolean) => setIsLogoSticky(sticky), [])
  const handleSubheadlineStickyChange = useCallback(
    (sticky: boolean) => setIsSubheadlineSticky(sticky),
    [],
  )

  // Handle sticky header and expanded state for tablet/mobile
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return
      const headerRect = headerRef.current.getBoundingClientRect()
      // Becomes sticky when header would scroll past top with 24px offset
      setIsHeaderSticky(headerRect.top <= 24)

      // Expand logo when scrolled past hero section (sticky header height = 120px)
      if (sectionRef.current) {
        const sectionRect = sectionRef.current.getBoundingClientRect()
        setIsTabletExpanded(sectionRect.bottom <= 120)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Fixed backdrop for sticky elements - desktop only */}
      <div
        className={cn(
          'hidden desktop:block',
          'fixed top-0 left-0 right-0 z-10',
          'h-[120px]',
          'bg-oathfire',
        )}
        style={{ boxShadow: '0 4px 12px 0 var(--color-oathfire)' }}
      />

      <section
        ref={sectionRef}
        id='hero'
        className={cn('relative z-20', 'pt-16 pb-10 px-10 desktop:px-20', 'bg-oathfire')}
      >
        {/* Tablet/Mobile Layout (below desktop) */}
        <div className='desktop:hidden max-w-[1280px] mx-auto flex flex-col gap-[80px]'>
          {/* Sticky header row with logo and hamburger */}
          <div
            ref={headerRef}
            className={cn(
              'flex items-center justify-between',
              'transition-all duration-200',
              isHeaderSticky && 'fixed top-0 left-0 right-0 z-50 px-10 py-6 bg-oathfire',
            )}
            style={isHeaderSticky ? { boxShadow: '0 4px 12px 0 var(--color-oathfire)' } : undefined}
          >
            <DecorativeLogo className='w-[118px] h-[72px]' isExpanded={isTabletExpanded} />
            <HamburgerIcon onClick={() => setIsNavOpen(true)} />
          </div>

          {/* Spacer when header becomes fixed */}
          {isHeaderSticky && <div className='h-[72px]' />}

          {/* Text content */}
          <div className='flex flex-col gap-[20px]'>
            <h1 className={cn('text-[40px] font-normal italic leading-none text-moon-paper')}>
              {headline}
            </h1>
            <p className='text-[24px] font-light italic text-golden-sol'>{subheadline}</p>
          </div>
        </div>

        {/* Desktop Layout (1440px+) */}
        <div className='hidden desktop:grid max-w-[1280px] mx-auto grid-cols-[1fr_auto] gap-y-5'>
          <h1
            className={cn(
              'max-w-[612px]',
              'text-[48px] font-normal italic leading-none text-moon-paper',
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
            <p className={cn('max-w-[663px]', 'text-[24px] font-light italic text-golden-sol')}>
              {subheadline}
            </p>
          </Sticky>
        </div>
      </section>

      {/* Mobile navigation drawer - tablet/mobile only */}
      <MobileNav open={isNavOpen} onClose={() => setIsNavOpen(false)} nav={nav} ctaText={ctaText} />
    </>
  )
}
