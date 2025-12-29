import type { Experience } from '@/types/portfolio'

interface ExperienceSectionProps {
  experience: Experience[]
}

export const ExperienceSection = ({ experience }: ExperienceSectionProps) => (
  <section className="py-16 px-8 bg-[#770B1B]">
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-center mb-12">
        <span className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#AE8237] text-[#AE8237]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Experience
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="bg-[#F1EDE4] rounded-lg p-6 shadow-lg"
          >
            <h3 className="text-xl font-bold text-[#770B1B] mb-2">{exp.company}</h3>
            <p className="text-[#AE8237] font-medium mb-3">{exp.role}</p>
            {exp.description && (
              <p className="text-gray-700 text-sm">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
)
