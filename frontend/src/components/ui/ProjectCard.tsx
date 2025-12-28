import type { ReactNode } from 'react'

interface ProjectCardProps {
  title: string
  children: ReactNode
  className?: string
}

const ProjectCard = ({ title, children, className = '' }: ProjectCardProps) => (
  <div className={`bg-burgundy-card rounded-md overflow-hidden group cursor-pointer ${className}`}>
    <div className="relative aspect-[4/3] overflow-hidden">{children}</div>
    <div className="px-3 py-2.5 flex justify-between items-center gap-2">
      <span className="text-cream/70 text-[11px] font-lato leading-tight">{title}</span>
      <span className="text-cream/40 group-hover:text-gold transition-colors flex-shrink-0">
        <ArrowIcon />
      </span>
    </div>
  </div>
)

const ArrowIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 9L9 3M9 3H4.5M9 3V7.5"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default ProjectCard
