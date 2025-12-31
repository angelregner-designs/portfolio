'use client'

import type { Project } from '@/types/portfolio'

type ProjectsSectionProps = {
  projects: Project[]
  onChange: (projects: Project[]) => void
}

const ProjectsSection = ({ projects, onChange }: ProjectsSectionProps) => {
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

  const updatePhotos = (id: string, photosStr: string) => {
    const photos = photosStr.split('\n').filter(p => p.trim())
    updateProject(id, 'photos', photos)
  }

  return (
    <section className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Projects</h2>
        <button
          type='button'
          onClick={addProject}
          className='px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700'
        >
          + Add Project
        </button>
      </div>

      {projects.length === 0 && (
        <p className='text-gray-500 text-sm'>No projects yet. Click "Add Project" to create one.</p>
      )}

      <div className='space-y-6'>
        {projects.map((project, index) => (
          <div key={project.id} className='border border-gray-200 rounded-lg p-4'>
            <div className='flex justify-between items-center mb-3'>
              <span className='font-medium text-gray-700'>Project {index + 1}</span>
              <button
                type='button'
                onClick={() => removeProject(project.id)}
                className='text-red-600 hover:text-red-800 text-sm'
              >
                Remove
              </button>
            </div>
            <div className='space-y-3'>
              <div>
                <label htmlFor={`title-${project.id}`} className='block mb-1 text-sm font-medium'>
                  Title
                </label>
                <input
                  id={`title-${project.id}`}
                  type='text'
                  value={project.title}
                  onChange={e => updateProject(project.id, 'title', e.target.value)}
                  placeholder='Project title'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor={`thumbnail-${project.id}`}
                  className='block mb-1 text-sm font-medium'
                >
                  Thumbnail URL
                </label>
                <input
                  id={`thumbnail-${project.id}`}
                  type='text'
                  value={project.thumbnail}
                  onChange={e => updateProject(project.id, 'thumbnail', e.target.value)}
                  placeholder='https://picsum.photos/200/300'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor={`description-${project.id}`}
                  className='block mb-1 text-sm font-medium'
                >
                  Description
                </label>
                <textarea
                  id={`description-${project.id}`}
                  value={project.description}
                  onChange={e => updateProject(project.id, 'description', e.target.value)}
                  rows={2}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
              <div>
                <label htmlFor={`link-${project.id}`} className='block mb-1 text-sm font-medium'>
                  Link
                </label>
                <input
                  id={`link-${project.id}`}
                  type='text'
                  value={project.link}
                  onChange={e => updateProject(project.id, 'link', e.target.value)}
                  placeholder='https://example.com'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm'
                />
              </div>
              <div>
                <label htmlFor={`photos-${project.id}`} className='block mb-1 text-sm font-medium'>
                  Photos (one URL per line)
                </label>
                <textarea
                  id={`photos-${project.id}`}
                  value={project.photos.join('\n')}
                  onChange={e => updatePhotos(project.id, e.target.value)}
                  rows={3}
                  placeholder='https://picsum.photos/800/600&#10;https://picsum.photos/800/601'
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono'
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection
