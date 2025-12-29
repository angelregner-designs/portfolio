import type { Project } from '@/types/portfolio'

interface ProjectsSectionProps {
  title: string
  projects: Project[]
}

export const ProjectsSection = ({ title, projects }: ProjectsSectionProps) => (
  <section id="projects" className="py-16 px-8 bg-white">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
              {project.thumbnail && (
                <img
                  src={project.thumbnail}
                  alt={project.description}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="p-4">
                <p className="text-gray-700">{project.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
)
