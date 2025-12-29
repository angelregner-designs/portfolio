import type { Portfolio } from '@/types/portfolio'

export const HARDCODED_PORTFOLIO: Portfolio = {
  id: '1',
  heroHeadline: 'heroHeadline',
  heroSubheadline: 'heroSubheadline',
  projects: [
    {
      id: '1',
      thumbnail: 'https://picsum.photos/200/300',
      photos: ['https://picsum.photos/200/300'],
      description: 'projectDescription',
      link: 'https://example.com'
    }
  ],
  testimonials: [
    {
      id: '1',
      content: 'testimonialContent',
      personName: 'testimonialPersonName'
    }
  ],
  box1Title: 'box1Title',
  box1Content: 'box1Content',
  box2Title: 'box2Title',
  box2Content: 'box2Content',
  contactsHeadline: 'contactsHeadline',
  contactsCtaText: 'contactsCtaText',
  linkBehance: 'https://example.com',
  linkLinkedin: 'https://example.com',
  linkWhatsapp: 'https://example.com',
  linkFacebook: 'https://example.com',
  linkInstagram: 'https://example.com',
  footerCopyright: 'footerCopyright',
  footerNavProjects: 'footerNavProjects',
  footerNavTestimonials: 'footerNavTestimonials',
  footerNavAbout: 'footerNavAbout'
}
