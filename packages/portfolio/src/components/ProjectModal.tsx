'use client'

import type { Project } from '@/types/portfolio'
import { cn } from '@angel-portfolio/shared'
import { Dialog, DialogPanel } from '@headlessui/react'
import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'

type ProjectModalProps = {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

// Close X icon - uses currentColor for token support
const CloseIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path
      d='M18 6L6 18M6 6L18 18'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

// Chevron left icon - uses currentColor for token support
const ChevronLeftIcon = () => (
  <svg width='32' height='32' viewBox='0 0 32 32' fill='none' aria-hidden='true'>
    <path
      d='M20 24L12 16L20 8'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

// Chevron right icon - uses currentColor for token support
const ChevronRightIcon = () => (
  <svg width='32' height='32' viewBox='0 0 32 32' fill='none' aria-hidden='true'>
    <path
      d='M12 24L20 16L12 8'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

export const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  // Reset carousel to first slide when project changes
  useEffect(() => {
    if (emblaApi && project) {
      emblaApi.scrollTo(0, true)
    }
  }, [emblaApi, project])

  const photos = project?.photos?.length ? project.photos : project ? [project.thumbnail] : []

  return (
    <AnimatePresence>
      {isOpen && project && (
        <Dialog static open={isOpen} onClose={onClose} className='relative z-50'>
          {/* Backdrop - fade in/out */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn('fixed inset-0', 'bg-oathfire/80 backdrop-blur-[5px]')}
            aria-hidden='true'
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={cn('fixed inset-0', 'flex items-stretch justify-stretch', 'p-12')}
          >
            {/* Modal container - scale and fade in/out */}
            <DialogPanel
              className={cn(
                'relative',
                'flex flex-col',
                'w-full',
                'bg-moon-paper/10 border-[0.125rem] border-moon-paper',
                'rounded-[1.25rem] shadow-lg overflow-hidden',
              )}
            >
              {/* Close button */}
              <button
                type='button'
                onClick={onClose}
                className={cn(
                  'absolute top-2 right-2 z-1',
                  'p-2',
                  'text-moon-paper',
                  'rounded',
                  'transition-opacity',
                  'hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-moon-paper',
                )}
                aria-label='Close modal'
              >
                <CloseIcon />
              </button>

              {/* Carousel container */}
              <div
                className={cn(
                  'relative',
                  'flex flex-col justify-stretch items-stretch',
                  'flex-[1_1_0%]',
                )}
              >
                {/* Embla carousel - overflow-hidden required */}
                <div
                  className={cn(
                    'flex flex-col justify-stretch items-stretch',
                    'flex-[1_1_0%]',
                    'overflow-hidden',
                  )}
                  ref={emblaRef}
                >
                  {/* Embla container for slides - flex required */}
                  <div className='flex flex-[1_1_0%]'>
                    {photos.map((photo, index) => (
                      /* Embla slide item */
                      <div
                        key={photo}
                        className={cn('relative', 'flex-[0_0_100%] min-w-0', 'p-10')}
                      >
                        {/* Absolute container for scrollable content */}
                        <div
                          className={cn('absolute top-0 left-0', 'w-full h-full', 'overflow-auto')}
                        >
                          {/* Separate container for padding */}
                          <div
                            className={cn('flex justify-center items-center', 'min-h-full', 'p-10')}
                          >
                            <img
                              src={photo}
                              alt={`${project.title} - ${index + 1}`}
                              className='w-auto max-w-[824px] h-auto'
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer section with project title */}
              <div
                className={cn(
                  'flex items-center',
                  'flex-[0_1_auto] h-[112px]',
                  'py-4 px-6',
                  'bg-moon-paper/10',
                )}
              >
                <h2 className={cn('w-full', 'text-[24px] font-normal text-moon-paper text-center')}>
                  {project.title}
                </h2>
              </div>

              {/* Navigation arrows - fixed to carousel edges */}
              {canScrollPrev && (
                <button
                  type='button'
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  className={cn(
                    'absolute left-1 top-1/2 -translate-y-1/2 z-10',
                    'p-2',
                    'text-moon-paper',
                    'rounded',
                    'transition-opacity',
                    'hover:opacity-70 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-moon-paper',
                  )}
                  aria-label='Previous image'
                >
                  <ChevronLeftIcon />
                </button>
              )}

              {canScrollNext && (
                <button
                  type='button'
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  className={cn(
                    'absolute right-1 top-1/2 -translate-y-1/2 z-10',
                    'p-2',
                    'text-moon-paper',
                    'rounded',
                    'transition-opacity',
                    'hover:opacity-70 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-moon-paper',
                  )}
                  aria-label='Next image'
                >
                  <ChevronRightIcon />
                </button>
              )}
            </DialogPanel>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
