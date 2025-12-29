'use client'

import { useState } from 'react'
import type { Project } from '@/types/portfolio'
import classNames from 'classnames'
import { ProjectModal } from './ProjectModal'

interface ProjectsSectionProps {
  projects: Project[]
}

// Arrow icon for project cards
const ArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M6.14017 17.5729L14.8022 8.91084H7.3776L7.31396 7.91382H16.5064V17.1062L15.5093 17.0426V9.61795L6.84727 18.28L6.14017 17.5729Z"
      fill="#F1EDE4"
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
    <section id="projects" className="py-0 px-20 bg-[#770B1B]">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col gap-14">
          {
            projects
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
                  <div key={rowIndex} className="flex gap-0">
                    {row.map((project, projectIndex) => {
                      const isBig = !isOddRow && projectIndex === 0 || isOddRow && projectIndex === 1
                      const isLeft = projectIndex === 0

                      return (
                        <div
                          key={project.id}
                          className={classNames(
                            isBig ? 'basis-639/1000' : isLeft ? 'pr-14' : 'pl-14',
                            isBig ? 'flex-shrink-0 flex-grow-0' : 'flex-shrink-1 flex-grow-0'
                          )}
                        >
                          <ProjectCard project={project} onOpenModal={openModal} />
                        </div>
                      )
                    })}
                  </div>
                )
              })
          }
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  )
}

interface ProjectCardProps {
  project: Project
  onOpenModal: (project: Project) => void
}

const ProjectCard = ({ project, onOpenModal }: ProjectCardProps) => {
  const handleCardClick = () => {
    onOpenModal(project)
  }

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(project.link, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleCardClick}
      className="group block cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* Card container with transparent border */}
      <div className="bg-[rgba(241,237,228,0.1)] border border-[#f1ede4] rounded-[12px] overflow-hidden">
        {/* Image area - 420px height */}
        {project.thumbnail && (
          <div className="h-[420px] overflow-hidden">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        {/* Title bar - 70px height */}
        <div className="bg-[rgba(241,237,228,0.1)] h-[70px] flex items-center justify-between px-6 gap-[10px]">
          <p className="text-[18px] not-italic text-[#F1EDE4] flex-1">
            {project.title}
          </p>
          <button
            onClick={handleLinkClick}
            className="hover:opacity-70 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F1EDE4] rounded"
            aria-label={`Open ${project.title} in new tab`}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  )
}
