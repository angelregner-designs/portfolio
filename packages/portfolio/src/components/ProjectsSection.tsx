'use client'

import { trackEvent } from '@/lib/analytics'
import type { Project } from '@/types/portfolio'
import { cn } from '@angel-portfolio/shared'
import { useState } from 'react'
import { NEXT_SECTION_MARGIN_TOP } from './HeroSection.const'
import { ProjectModal } from './ProjectModal'

type ProjectsSectionProps = {
  projects: Project[]
}

// Arrow icon for project cards - uses currentColor for token support
const ArrowIcon = () => (
  <svg width='24' height='24' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
    <path
      d='M6.14017 17.5729L14.8022 8.91084H7.3776L7.31396 7.91382H16.5064V17.1062L15.5093 17.0426V9.61795L6.84727 18.28L6.14017 17.5729Z'
      fill='currentColor'
    />
  </svg>
)

export const ProjectsSection = ({ projects }: ProjectsSectionProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <section
      id='projects'
      className={cn('pt-10 pb-[108px] md:pb-40 px-6 md:px-10 desktop:px-20', 'bg-oathfire')}
      style={
        {
          '--next-section-margin-top': `${NEXT_SECTION_MARGIN_TOP}px`,
        } as React.CSSProperties
      }
    >
      <div className='max-w-[1280px] mx-auto'>
        <div className={cn('flex flex-col', 'gap-6 md:gap-12 desktop:gap-14')}>
          {projects
            // group projects into rows of 2
            .reduce((acc, project, index) => {
              if (index % 2 === 0) {
                acc.push([])
              }
              acc[acc.length - 1].push(project)
              return acc
            }, [] as Project[][])
            .map((row, rowIndex) => {
              const isOddRow = rowIndex % 2 === 1

              return (
                // tablet: single column (flex-col), desktop: 2-column row (flex-row)
                <div
                  key={row.map(p => p.id).join('-')}
                  className={cn('flex flex-col desktop:flex-row', 'gap-6 md:gap-12 desktop:gap-0')}
                >
                  {row.map((project, projectIndex) => {
                    const isBig =
                      (!isOddRow && projectIndex === 0) || (isOddRow && projectIndex === 1)

                    return (
                      <div
                        key={project.id}
                        className={cn(
                          // tablet: full width, desktop: original sizing
                          'w-full',
                          isBig && 'desktop:basis-639/1000',
                          isBig
                            ? 'desktop:flex-shrink-0 desktop:flex-grow-0'
                            : 'desktop:flex-shrink-1 desktop:flex-grow-0',
                        )}
                      >
                        <ProjectCard project={project} onOpenModal={openModal} />
                      </div>
                    )
                  })}
                </div>
              )
            })}
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}

type ProjectCardProps = {
  project: Project
  onOpenModal: (project: Project) => void
}

const ProjectCard = ({ project, onOpenModal }: ProjectCardProps) => {
  const handleCardClick = () => {
    trackEvent('project_view', { project_id: project.id, project_title: project.title })
    onOpenModal(project)
  }

  return (
    <button
      type='button'
      onClick={handleCardClick}
      className={cn('group block', 'w-full', 'text-left', 'cursor-pointer')}
    >
      {/* Card container with transparent border */}
      <div
        className={cn(
          'bg-moon-paper/10 border border-moon-paper',
          'rounded-[12px] overflow-hidden',
        )}
      >
        {/* Image area - 420px height */}
        {project.thumbnail && (
          <div className='h-[272px] md:h-[420px] overflow-hidden'>
            <img
              src={project.thumbnail}
              alt={project.title}
              className={cn(
                'w-full h-full',
                'object-cover',
                'transition-transform duration-300',
                'group-hover:scale-105',
              )}
            />
          </div>
        )}
        {/* Title bar - 70px height */}
        <div
          className={cn(
            'flex items-center justify-between',
            'h-[70px]',
            'px-6 gap-[10px]',
            'bg-moon-paper/10',
          )}
        >
          <p className='text-[16px] md:text-[18px] not-italic text-moon-paper flex-1'>
            {project.title}
          </p>
          {project.link && (
            <a
              href={project.link}
              target='_blank'
              rel='noopener noreferrer'
              onClick={e => e.stopPropagation()}
              className={cn(
                'text-moon-paper',
                'rounded',
                'transition-opacity',
                'hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-moon-paper',
              )}
              aria-label={`Open ${project.title} in new tab`}
            >
              <ArrowIcon />
            </a>
          )}
        </div>
      </div>
    </button>
  )
}
