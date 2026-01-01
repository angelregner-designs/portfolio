'use client'

import ImageUpload from '@/components/ui/ImageUpload'
import MultiImageUpload from '@/components/ui/MultiImageUpload'
import SortableItem from '@/components/ui/SortableItem'
import { useImageUpload } from '@/hooks/useImageUpload'
import type { Project } from '@/types/portfolio'
import { cn } from '@angel-portfolio/shared'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'

type ProjectsSectionProps = {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

// Check if project is empty (new)
const isProjectEmpty = (project: Project) =>
  !project.title &&
  !project.thumbnail &&
  !project.description &&
  !project.link &&
  project.photos.length === 0

const ProjectsSection = ({ projects, onChange }: ProjectsSectionProps) => {
  const { uploadThumbnail, uploadPhotos, deleteImage } = useImageUpload()
  // Track expanded items by ID
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const isExpanded = (project: Project) => expandedIds.has(project.id) || isProjectEmpty(project)

  const addProject = () => {
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: '',
      thumbnail: '',
      photos: [],
      description: '',
      link: '',
    }
    onChange([...projects, newProject])
  }

  const updateProject = (id: string, field: keyof Project, value: string | string[]) => {
    onChange(projects.map(p => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const removeProject = (id: string) => {
    onChange(projects.filter(p => p.id !== id))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id)
      const newIndex = projects.findIndex(p => p.id === over.id)
      onChange(arrayMove(projects, oldIndex, newIndex))
    }
  }

  return (
    <section className={cn('mb-6 p-6', 'bg-white', 'rounded-lg shadow-md')}>
      <div className={cn('flex items-center justify-between', 'mb-4')}>
        <h2 className='text-xl font-semibold'>Projects</h2>
        <button
          type='button'
          onClick={addProject}
          className={cn(
            'px-3 py-1.5',
            'text-sm',
            'text-white bg-green-600',
            'rounded-md',
            'hover:bg-green-700',
          )}
        >
          + Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <p className={cn('text-sm', 'text-gray-500')}>
          No projects yet. Click "Add Project" to create one.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className='space-y-6'>
            {projects.map((project, index) => {
              const expanded = isExpanded(project)
              return (
                <SortableItem key={project.id} id={project.id}>
                  <div className={cn('p-4 pl-10', 'border border-gray-200', 'rounded-lg')}>
                    <div
                      className={cn(
                        'flex items-center justify-between',
                        !expanded && 'mb-0',
                        expanded && 'mb-3',
                      )}
                    >
                      <button
                        type='button'
                        onClick={() => toggleExpanded(project.id)}
                        className={cn('flex items-center gap-2', 'text-left')}
                      >
                        {/* Chevron */}
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          aria-hidden='true'
                          className={cn(
                            'h-5 w-5',
                            'text-gray-500',
                            'transition-transform',
                            expanded && 'rotate-90',
                          )}
                        >
                          <path
                            fillRule='evenodd'
                            d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span className={cn('font-medium', 'text-gray-700')}>
                          Project {index + 1}
                          {!expanded && project.title && (
                            <span className='ml-2 font-normal text-gray-500'>
                              — {project.title}
                            </span>
                          )}
                        </span>
                      </button>
                      <button
                        type='button'
                        onClick={() => removeProject(project.id)}
                        className={cn('text-sm', 'text-red-600', 'hover:text-red-800')}
                      >
                        Remove
                      </button>
                    </div>

                    {expanded && (
                      <div className='space-y-3'>
                        <div>
                          <label
                            htmlFor={`title-${project.id}`}
                            className={cn('block', 'mb-1', 'text-sm font-medium')}
                          >
                            Title
                          </label>
                          <input
                            id={`title-${project.id}`}
                            type='text'
                            value={project.title}
                            onChange={e => updateProject(project.id, 'title', e.target.value)}
                            placeholder='Project title'
                            className={cn(
                              'w-full',
                              'px-3 py-2',
                              'text-sm',
                              'border border-gray-300',
                              'rounded-md',
                              'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500',
                            )}
                          />
                        </div>

                        {/* Thumbnail upload */}
                        <ImageUpload
                          label='Thumbnail'
                          value={project.thumbnail}
                          onChange={url => updateProject(project.id, 'thumbnail', url)}
                          onUpload={file => uploadThumbnail(project.id, file)}
                          onDelete={deleteImage}
                        />

                        <div>
                          <label
                            htmlFor={`description-${project.id}`}
                            className={cn('block', 'mb-1', 'text-sm font-medium')}
                          >
                            Description
                          </label>
                          <textarea
                            id={`description-${project.id}`}
                            value={project.description}
                            onChange={e => updateProject(project.id, 'description', e.target.value)}
                            rows={2}
                            className={cn(
                              'w-full',
                              'px-3 py-2',
                              'text-sm',
                              'border border-gray-300',
                              'rounded-md',
                              'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500',
                            )}
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`link-${project.id}`}
                            className={cn('block', 'mb-1', 'text-sm font-medium')}
                          >
                            Link
                          </label>
                          <input
                            id={`link-${project.id}`}
                            type='text'
                            value={project.link}
                            onChange={e => updateProject(project.id, 'link', e.target.value)}
                            placeholder='https://example.com'
                            className={cn(
                              'w-full',
                              'px-3 py-2',
                              'text-sm',
                              'border border-gray-300',
                              'rounded-md',
                              'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500',
                            )}
                          />
                        </div>

                        {/* Photos upload */}
                        <MultiImageUpload
                          label='Photos'
                          values={project.photos}
                          onChange={urls => updateProject(project.id, 'photos', urls)}
                          onUpload={files => uploadPhotos(project.id, files)}
                          onDelete={deleteImage}
                        />
                      </div>
                    )}
                  </div>
                </SortableItem>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  )
}

export default ProjectsSection
