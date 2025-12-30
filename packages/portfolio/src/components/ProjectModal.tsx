'use client'

import type { Project } from '@/types/portfolio'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

// Close X icon
const CloseIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path
      d='M18 6L6 18M6 6L18 18'
      stroke='#F1EDE4'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

// Chevron left icon
const ChevronLeftIcon = () => (
  <svg width='32' height='32' viewBox='0 0 32 32' fill='none' aria-hidden='true'>
    <path
      d='M20 24L12 16L20 8'
      stroke='#F1EDE4'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

// Chevron right icon
const ChevronRightIcon = () => (
  <svg width='32' height='32' viewBox='0 0 32 32' fill='none' aria-hidden='true'>
    <path
      d='M12 24L20 16L12 8'
      stroke='#F1EDE4'
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

  if (!project) return null

  const photos = project.photos?.length > 0 ? project.photos : [project.thumbnail]

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      {/* Backdrop */}
      <DialogBackdrop
        transition
        className='fixed inset-0 bg-[#770B1B]/80 backdrop-blur-[5px] transition-opacity duration-300 data-[closed]:opacity-0'
      />

      {/* Modal content */}
      <div className='fixed inset-0 flex items-stretch justify-stretch p-12'>
        {/* Modal container with background and border */}
        <DialogPanel
          transition
          className='relative w-full transition-all duration-300 data-[closed]:opacity-0 data-[closed]:scale-95 bg-[#F1EDE4]/10 rounded-[1.25rem] border-[0.125rem] border-[#F1EDE4] shadow-[0px_69px_139px_0px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col'
        >
          {/* Close button */}
          <button
            type='button'
            onClick={onClose}
            className='absolute top-2 right-2 p-2 hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EDE4] rounded z-1'
            aria-label='Close modal'
          >
            <CloseIcon />
          </button>

          {/* Carousel container */}
          <div className='relative flex-[1_1_0%] flex flex-col justify-stretch items-stretch'>
            {/* Embla carousel - overflow-hidden required */}
            <div
              className='overflow-hidden flex-[1_1_0%] flex flex-col justify-stretch items-stretch'
              ref={emblaRef}
            >
              {/* Embla container for slides - flex required */}
              <div className='flex flex-[1_1_0%]'>
                {photos.map((photo, index) => (
                  /* Embla slide item */
                  <div key={photo} className='flex-[0_0_100%] min-w-0 p-10 relative'>
                    {/* Absolute container for scrollable content */}
                    <div className='absolute top-0 left-0 w-full h-full overflow-auto'>
                      {/* Separate container for padding */}
                      <div className='p-10 min-h-full flex justify-center items-center '>
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
          <div className='bg-[#F1EDE4]/10 py-4 px-6 flex-[0_1_auto] h-[112px] flex items-center'>
            <h2 className='text-[24px] text-[#F1EDE4] font-normal text-center w-full'>
              {project.title}
            </h2>
          </div>

          {/* Navigation arrows - fixed to carousel edges */}
          {canScrollPrev && (
            <button
              type='button'
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className='absolute left-1 top-1/2 -translate-y-1/2 z-10 p-2 hover:opacity-70 transition-opacity disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EDE4] rounded'
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
              className='absolute right-1 top-1/2 -translate-y-1/2 z-10 p-2 hover:opacity-70 transition-opacity disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EDE4] rounded'
              aria-label='Next image'
            >
              <ChevronRightIcon />
            </button>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  )
}
