import type { Portfolio } from '@/types/portfolio'
import { AboutSection } from './AboutSection'
import { ContactSection } from './ContactSection'
import { Footer } from './Footer'
import { HeroSection } from './HeroSection'
import { ProjectsSection } from './ProjectsSection'
import { StickyBottomNav } from './StickyBottomNav'
import { TestimonialsSection } from './TestimonialsSection'
import { WhyIDesignSection } from './WhyIDesignSection'

type PortfolioPageProps = {
  portfolio: Portfolio
}

export const PortfolioPage = ({ portfolio }: PortfolioPageProps) => (
  <main className='min-h-screen bg-[#770B1B]'>
    <HeroSection
      headline={portfolio.heroHeadline}
      subheadline={portfolio.heroSubheadline}
      nav={{
        projects: portfolio.footerNavProjects,
        testimonials: portfolio.footerNavTestimonials,
        about: portfolio.footerNavAbout,
      }}
      ctaText={portfolio.footerCtaText}
    />

    <ProjectsSection projects={portfolio.projects} />

    <TestimonialsSection testimonials={portfolio.testimonials} />

    <AboutSection title={portfolio.aboutMeTitle} content={portfolio.aboutMeContent} />

    <WhyIDesignSection title={portfolio.whyIDesignTitle} content={portfolio.whyIDesignContent} />

    <ContactSection
      headline={portfolio.contactsHeadline}
      ctaText={portfolio.contactsCtaText}
      socialLinks={{
        behance: portfolio.linkBehance,
        linkedin: portfolio.linkLinkedin,
        whatsapp: portfolio.linkWhatsapp,
        facebook: portfolio.linkFacebook,
        instagram: portfolio.linkInstagram,
        email: portfolio.linkEmail,
      }}
    />

    <Footer copyright={portfolio.footerCopyright} />

    <StickyBottomNav
      nav={{
        projects: portfolio.footerNavProjects,
        testimonials: portfolio.footerNavTestimonials,
        about: portfolio.footerNavAbout,
      }}
      ctaText={portfolio.footerCtaText}
    />
  </main>
)
