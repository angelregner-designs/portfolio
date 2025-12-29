export interface Project {
  id: string
  title: string
  thumbnail: string
  photos: string[]
  description: string
  link: string
}

export interface Testimonial {
  id: string
  content: string
  personName: string
  company?: string
}

export interface Experience {
  id: string
  company: string
  role: string
  period?: string
  description?: string
  logo?: string
}

export interface SocialLinks {
  behance?: string
  linkedin?: string
  whatsapp?: string
  facebook?: string
  instagram?: string
  email?: string
}

export interface FooterNav {
  projects: string
  testimonials: string
  about: string
}

export interface Portfolio {
  id: string
  heroHeadline: string
  heroSubheadline: string
  projects: Project[]
  experience: Experience[]
  testimonials: Testimonial[]
  aboutMeTitle: string
  aboutMeContent: string
  whyIDesignTitle: string
  whyIDesignContent: string
  contactsHeadline: string
  contactsCtaText: string
  linkBehance: string
  linkLinkedin: string
  linkWhatsapp: string
  linkFacebook: string
  linkInstagram: string
  linkEmail: string
  footerCopyright: string
  footerNavProjects: string
  footerNavTestimonials: string
  footerNavAbout: string
  footerCtaText: string
}
