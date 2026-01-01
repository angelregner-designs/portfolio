'use client'

import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn } from '@angel-portfolio/shared'

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
    // Projects is first section - scroll to page top
    if (sectionId === 'projects') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const element = document.getElementById(sectionId)
    if (!element) return
    // Offset for fixed header background (120px)
    const top = element.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const navLinkClasses = (section: NavSection) =>
    cn('px-5 py-2 text-[18px] italic text-golden-sol rounded-lg transition-all', {
      'bg-golden-sol/20 shadow-inset': activeSection === section,
      'hover:bg-golden-sol/20 hover:shadow-inset': activeSection !== section,
    })

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 transform -translate-x-1/2',
        'hidden desktop:flex items-center',
        'gap-8 p-3',
        'bg-moon-paper border-2 border-golden-sol',
        'rounded-2xl shadow-md',
      )}
    >
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
        className={cn(
          'px-5 py-3',
          'text-[18px] font-light text-moon-paper',
          'bg-earthward',
          'rounded-lg shadow-sm',
          'transition-colors',
          'hover:bg-golden-sol',
        )}
      >
        {ctaText}
      </button>
    </div>
  )
}
