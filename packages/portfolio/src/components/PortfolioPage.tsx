import type { Portfolio } from '@/types/portfolio'
import { HeroSection } from './HeroSection'
import { ProjectsSection } from './ProjectsSection'
import { TestimonialsSection } from './TestimonialsSection'
import { AboutSection } from './AboutSection'
import { WhyIDesignSection } from './WhyIDesignSection'
import { ContactSection } from './ContactSection'
import { Footer } from './Footer'

interface PortfolioPageProps {
  portfolio: Portfolio
}

export const PortfolioPage = ({ portfolio }: PortfolioPageProps) => (
  <main className="min-h-screen bg-[#770B1B]">
    <HeroSection
      headline={portfolio.heroHeadline}
      subheadline={portfolio.heroSubheadline}
    />

    <ProjectsSection projects={portfolio.projects} />

    <TestimonialsSection testimonials={portfolio.testimonials} />

    <AboutSection
      title={portfolio.aboutMeTitle}
      content={portfolio.aboutMeContent}
    />

    <WhyIDesignSection
      title={portfolio.whyIDesignTitle}
      content={portfolio.whyIDesignContent}
    />

    <ContactSection
      headline={portfolio.contactsHeadline}
      ctaText={portfolio.footerCtaText}
      socialLinks={{
        behance: portfolio.linkBehance,
        linkedin: portfolio.linkLinkedin,
        whatsapp: portfolio.linkWhatsapp,
        facebook: portfolio.linkFacebook,
        instagram: portfolio.linkInstagram,
        email: portfolio.linkEmail,
      }}
    />

    <Footer
      copyright={portfolio.footerCopyright}
      nav={{
        projects: portfolio.footerNavProjects,
        testimonials: portfolio.footerNavTestimonials,
        about: portfolio.footerNavAbout,
      }}
      ctaText={portfolio.footerCtaText}
    />
  </main>
)
