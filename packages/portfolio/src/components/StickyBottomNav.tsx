'use client'

import { useScrollSpy } from '@/hooks/useScrollSpy'
import classNames from 'classnames'

type StickyBottomNavProps = {
  nav: {
    projects: string
    testimonials: string
    about: string
  }
  ctaText: string
}

const navSections = ['projects', 'testimonials', 'about'] as const
type NavSection = (typeof navSections)[number]

export const StickyBottomNav = ({ nav, ctaText }: StickyBottomNavProps) => {
  const activeSection = useScrollSpy({
    sections: navSections,
    deactivateOn: 'connect',
    initialSection: 'projects' as NavSection,
  })

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navLinkClasses = (section: NavSection) =>
    classNames('px-5 py-2 text-[18px] italic text-[#AE8237] rounded-lg transition-all', {
      'bg-[rgba(174,130,55,0.2)] shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.1)]':
        activeSection === section,
      'hover:bg-[rgba(174,130,55,0.2)] hover:shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.1)]':
        activeSection !== section,
    })

  return (
    <div className='fixed bottom-25 left-1/2 transform -translate-x-1/2 bg-[#F1EDE4] border-2 border-[#AE8237] rounded-2xl p-3 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] flex items-center gap-8'>
      <nav className='flex items-center gap-4'>
        <button
          type='button'
          onClick={() => scrollToSection('projects')}
          className={navLinkClasses('projects')}
        >
          {nav.projects}
        </button>
        <button
          type='button'
          onClick={() => scrollToSection('testimonials')}
          className={navLinkClasses('testimonials')}
        >
          {nav.testimonials}
        </button>
        <button
          type='button'
          onClick={() => scrollToSection('about')}
          className={navLinkClasses('about')}
        >
          {nav.about}
        </button>
      </nav>
      <button
        type='button'
        onClick={() => scrollToSection('connect')}
        className='bg-[#817548] rounded-lg px-5 py-3 text-[18px] font-light text-[#F1EDE4] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.15)] hover:bg-[#AE8237] transition-colors'
      >
        {ctaText}
      </button>
    </div>
  )
}
