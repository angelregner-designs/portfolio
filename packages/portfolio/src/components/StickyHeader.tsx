'use client'

import { useState, useEffect } from 'react'
import classNames from 'classnames'
import { HeaderLogo } from './HeaderLogo'

export const StickyHeader = () => {
  const isHeroVisible = useHeroVisibility()

  return (
    <header
      className={classNames(
        'fixed top-0 left-0 right-0 z-50 bg-[#770B1B] px-20 pt-16 pb-10 transition-all duration-300 shadow-[0_8px_24px_rgba(119,11,27,0.8)]',
        isHeroVisible
          ? 'opacity-0 pointer-events-none'
          : 'opacity-100'
      )}
    >
      <div className="max-w-[1280px] mx-auto flex items-center justify-between">
        <p className="text-[24px] font-light italic text-[#AE8237]">
          Angel Regner | Product, Brand, and Digital Designer
        </p>
        <HeaderLogo />
      </div>
    </header>
  )
}

// Hook to detect when hero section is visible
const useHeroVisibility = () => {
  const [isHeroVisible, setIsHeroVisible] = useState(true)

  useEffect(() => {
    const heroElement = document.getElementById('hero')
    if (!heroElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show header when hero is NOT intersecting (scrolled past)
        setIsHeroVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(heroElement)
    return () => observer.disconnect()
  }, [])

  return isHeroVisible
}
