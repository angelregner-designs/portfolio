'use client'

import ImageUpload from '@/components/ui/ImageUpload'
import MultiImageUpload from '@/components/ui/MultiImageUpload'
import { useImageUpload } from '@/hooks/useImageUpload'
import type { Project } from '@/types/portfolio'
import { cn } from '@angel-portfolio/shared'

type ProjectsSectionProps = {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

const ProjectsSection = ({ projects, onChange }: ProjectsSectionProps) => {
  const { uploadThumbnail, uploadPhotos, deleteImage } = useImageUpload()

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

      <div className='space-y-6'>
        {projects.map((project, index) => (
          <div key={project.id} className={cn('p-4', 'border border-gray-200', 'rounded-lg')}>
            <div className={cn('flex items-center justify-between', 'mb-3')}>
              <span className={cn('font-medium', 'text-gray-700')}>Project {index + 1}</span>
              <button
                type='button'
                onClick={() => removeProject(project.id)}
                className={cn('text-sm', 'text-red-600', 'hover:text-red-800')}
              >
                Remove
              </button>
            </div>
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
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection
