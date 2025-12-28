import { ProjectCard } from '../ui'

interface Project {
  id: string
  title: string
  image: string
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Website Designs for Luxury Homes | Villa Vision Builder',
    image: '/projects/villa-vision.jpg',
  },
  {
    id: '2',
    title: 'Logo and Brand Concepts | MNCH',
    image: '/projects/mnch.jpg',
  },
  {
    id: '3',
    title: 'Logo and Brand Concepts | NexaReach',
    image: '/projects/nexareach.jpg',
  },
  {
    id: '4',
    title: 'Brand Refresh for a Wellness and Coaching Brand | Lo Rox',
    image: '/projects/lorox.jpg',
  },
  {
    id: '5',
    title: 'UI UX Design & Ads Assets for a Real Estate SaaS App | Propelio',
    image: '/projects/propelio.jpg',
  },
  {
    id: '6',
    title: 'Brand Identity Design | Angel Regner',
    image: '/projects/angel-brand.jpg',
  },
  {
    id: '7',
    title: 'Brand Concepts | Bloom Social',
    image: '/projects/bloom-social.jpg',
  },
  {
    id: '8',
    title: 'Logo, Landing Page, and Email Design | MUM BRAIN',
    image: '/projects/mum-brain.jpg',
  },
  {
    id: '9',
    title: 'Branding Design & Print Assets for Cookie Brand | The Chunks',
    image: '/projects/the-chunks.jpg',
  },
  {
    id: '10',
    title: 'Branding & Product Design | AKOKITA',
    image: '/projects/akokita.jpg',
  },
]

const Portfolio = () => (
  <section className="bg-burgundy px-8 md:px-12 lg:px-16 pb-8">
    <div className="max-w-6xl mx-auto">
      {/* Row 1: 60/40 split */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <ProjectCard title={projects[0]?.title ?? ''} className="md:col-span-3">
          <ProjectImage src={projects[0]?.image ?? ''} />
        </ProjectCard>
        <ProjectCard title={projects[1]?.title ?? ''} className="md:col-span-2">
          <ProjectImage src={projects[1]?.image ?? ''} />
        </ProjectCard>
      </div>

      {/* Row 2: 30/70 split */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <ProjectCard title={projects[2]?.title ?? ''} className="md:col-span-2">
          <ProjectImage src={projects[2]?.image ?? ''} />
        </ProjectCard>
        <ProjectCard title={projects[3]?.title ?? ''} className="md:col-span-3">
          <ProjectImage src={projects[3]?.image ?? ''} />
        </ProjectCard>
      </div>

      {/* Row 3: 50/50 split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <ProjectCard title={projects[4]?.title ?? ''}>
          <ProjectImage src={projects[4]?.image ?? ''} />
        </ProjectCard>
        <ProjectCard title={projects[5]?.title ?? ''}>
          <ProjectImage src={projects[5]?.image ?? ''} />
        </ProjectCard>
      </div>

      {/* Row 4: 30/70 split */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <ProjectCard title={projects[6]?.title ?? ''} className="md:col-span-2">
          <ProjectImage src={projects[6]?.image ?? ''} />
        </ProjectCard>
        <ProjectCard title={projects[7]?.title ?? ''} className="md:col-span-3">
          <ProjectImage src={projects[7]?.image ?? ''} />
        </ProjectCard>
      </div>

      {/* Row 5: 50/50 split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProjectCard title={projects[8]?.title ?? ''}>
          <ProjectImage src={projects[8]?.image ?? ''} />
        </ProjectCard>
        <ProjectCard title={projects[9]?.title ?? ''}>
          <ProjectImage src={projects[9]?.image ?? ''} />
        </ProjectCard>
      </div>
    </div>
  </section>
)

const ProjectImage = ({ src }: { src: string }) => (
  <div
    className="w-full h-full bg-burgundy-dark"
    style={{
      backgroundImage: `url(${src})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  />
)

export default Portfolio
