import type { Portfolio } from '@/types/portfolio'
import { HeroSection } from './HeroSection'
import { ProjectsSection } from './ProjectsSection'
import { BoxesSection } from './BoxesSection'
import { TestimonialsSection } from './TestimonialsSection'
import { ContactSection } from './ContactSection'
import { Footer } from './Footer'

interface PortfolioPageProps {
  portfolio: Portfolio
}

export const PortfolioPage = ({ portfolio }: PortfolioPageProps) => (
  <main className="min-h-screen">
    <HeroSection
      headline={portfolio.heroHeadline}
      subheadline={portfolio.heroSubheadline}
    />

    <ProjectsSection
      title={portfolio.footerNavProjects}
      projects={portfolio.projects}
    />

    <BoxesSection
      box1={{ title: portfolio.box1Title, content: portfolio.box1Content }}
      box2={{ title: portfolio.box2Title, content: portfolio.box2Content }}
    />

    <TestimonialsSection
      title={portfolio.footerNavTestimonials}
      testimonials={portfolio.testimonials}
    />

    <ContactSection
      headline={portfolio.contactsHeadline}
      ctaText={portfolio.contactsCtaText}
      socialLinks={{
        behance: portfolio.linkBehance,
        linkedin: portfolio.linkLinkedin,
        whatsapp: portfolio.linkWhatsapp,
        facebook: portfolio.linkFacebook,
        instagram: portfolio.linkInstagram,
      }}
    />

    <Footer
      copyright={portfolio.footerCopyright}
      nav={{
        projects: portfolio.footerNavProjects,
        testimonials: portfolio.footerNavTestimonials,
        about: portfolio.footerNavAbout,
      }}
    />
  </main>
)
