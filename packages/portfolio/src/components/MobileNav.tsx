'use client'

import { cn } from '@angel-portfolio/shared'
import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'

type MobileNavProps = {
  open: boolean
  onClose: () => void
  nav: {
    projects: string
    testimonials: string
    about: string
  }
  ctaText: string
}

const navSections = ['projects', 'testimonials', 'about'] as const
type NavSection = (typeof navSections)[number]

// Close icon (X)
const CloseIcon = () => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    aria-hidden='true'
  >
    <line x1='8' y1='8' x2='24' y2='24' />
    <line x1='24' y1='8' x2='8' y2='24' />
  </svg>
)

// Calculate active section based on current scroll position
const getActiveSection = (): NavSection => {
  const viewportCenter = window.innerHeight / 2

  for (const sectionId of [...navSections].reverse()) {
    const element = document.getElementById(sectionId)
    if (!element) continue
    const rect = element.getBoundingClientRect()
    // Section is active if its top is above viewport center
    if (rect.top <= viewportCenter) {
      return sectionId
    }
  }
  return 'projects'
}

export const MobileNav = ({ open, onClose, nav, ctaText }: MobileNavProps) => {
  const [activeSection, setActiveSection] = useState<NavSection>('projects')

  // Recalculate active section when drawer opens
  useEffect(() => {
    if (open) {
      setActiveSection(getActiveSection())
    }
  }, [open])

  const scrollToSection = (sectionId: string) => {
    onClose()

    // Small delay to let drawer close before scrolling
    setTimeout(() => {
      if (sectionId === 'projects') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      const element = document.getElementById(sectionId)
      if (!element) return
      // Offset for sticky header (120px)
      const top = element.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top, behavior: 'smooth' })
    }, 300)
  }

  const navLinkClasses = (section: NavSection) =>
    cn(
      'w-full px-6 py-4',
      'text-[24px] italic text-moon-paper text-center',
      'rounded-lg transition-all',
      activeSection === section && 'bg-golden-sol/20',
    )

  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className='relative z-50'>
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <DialogBackdrop className='fixed inset-0 bg-black/60' />
        </TransitionChild>

        {/* Drawer panel */}
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='translate-x-full'
          enterTo='translate-x-0'
          leave='ease-in duration-200'
          leaveFrom='translate-x-0'
          leaveTo='translate-x-full'
        >
          <DialogPanel
            className={cn(
              'fixed top-0 right-0 bottom-0',
              'w-[80%] max-w-[400px]',
              'flex flex-col',
              'bg-oathfire',
              'outline-none',
            )}
          >
            {/* Header with close button */}
            <div className='flex justify-end p-6'>
              <button
                type='button'
                onClick={onClose}
                className='text-golden-sol hover:text-moon-paper transition-colors'
                aria-label='Close menu'
              >
                <CloseIcon />
              </button>
            </div>

            {/* Navigation links */}
            <nav className='flex flex-col items-center gap-2 px-6 py-8'>
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

            {/* CTA button at bottom */}
            <div className='mt-auto p-6'>
              <button
                type='button'
                onClick={() => scrollToSection('connect')}
                className={cn(
                  'w-full px-6 py-4',
                  'text-[20px] font-light text-moon-paper',
                  'bg-earthward',
                  'rounded-lg',
                  'transition-colors',
                  'hover:bg-golden-sol',
                )}
              >
                {ctaText}
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  )
}
