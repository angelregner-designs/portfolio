'use client'

import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { DecorativeLogo } from './DecorativeLogo'
import { HeaderLogo } from './HeaderLogo'
import {
  HEADLINE_MARGIN_BOTTOM,
  STICKY_SUBHEAD_BOT_PAD,
  STICKY_SUBHEAD_TOP_PAD,
} from './HeroSection.const'

interface HeroSectionProps {
  headline: string
  subheadline: string
}

export const HeroSection = ({ headline, subheadline }: HeroSectionProps) => {
  const isSticky = useStickyDetection()

  return (
    <>
      <section
        id='hero'
        style={
          {
            '--headlineMb': `${HEADLINE_MARGIN_BOTTOM}px`,
          } as React.CSSProperties
        }
        className={'pt-16 px-20 bg-[#770B1B] relative z-50 mb-[var(--headlineMb)]'}
      >
        <div className='max-w-[1280px] mx-auto'>
          <h1
            className={classNames(
              'text-[48px] font-normal italic leading-none text-[#F1EDE4] max-w-[612px] transition-opacity duration-300',
              isSticky ? 'opacity-0' : 'opacity-100',
            )}
          >
            {headline}
          </h1>
        </div>
      </section>

      <FixedLogo isSticky={isSticky} />
      <StickySubheadline subheadline={subheadline} />
    </>
  )
}

// Detect when subheader enters sticky mode (hero scrolled out of view)
const useStickyDetection = () => {
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const heroElement = document.getElementById('hero')
    if (!heroElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0 },
    )

    observer.observe(heroElement)
    return () => observer.disconnect()
  }, [])

  return isSticky
}

// Fixed logo at top-right of viewport, switches between large and small logo
const FixedLogo = ({ isSticky }: { isSticky: boolean }) => (
  <div className='fixed top-16 right-20 z-50 pointer-events-none'>
    <div
      className={classNames(
        'transition-opacity duration-300',
        isSticky ? 'opacity-0' : 'opacity-100',
      )}
    >
      <DecorativeLogo />
    </div>
    <div
      className={classNames(
        'absolute top-0 right-0 transition-opacity duration-300',
        isSticky ? 'opacity-100' : 'opacity-0',
      )}
    >
      <HeaderLogo />
    </div>
  </div>
)

interface StickySubheadlineProps {
  subheadline: string
}

export const StickySubheadline = ({ subheadline }: StickySubheadlineProps) => (
  <div
    style={
      {
        '--stickySubheadPt': `${STICKY_SUBHEAD_TOP_PAD}px`,
        '--stickySubheadPb': `${STICKY_SUBHEAD_BOT_PAD}px`,
      } as React.CSSProperties
    }
    className={
      'sticky top-0 z-40 bg-[#770B1B] px-20 pt-[var(--stickySubheadPt)] pb-[var(--stickySubheadPb)] shadow-[0_8px_24px_rgba(119,11,27,0.8)]'
    }
  >
    <div className='max-w-[1280px] mx-auto'>
      <p className='text-[24px] font-light italic text-[#AE8237] max-w-[663px]'>{subheadline}</p>
    </div>
  </div>
)
