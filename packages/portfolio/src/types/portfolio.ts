export interface Project {
  id: string
  thumbnail: string
  photos: string[]
  description: string
  link: string
}

export interface Testimonial {
  id: string
  content: string
  personName: string
}

export interface SocialLinks {
  behance: string
  linkedin: string
  whatsapp: string
  facebook: string
  instagram: string
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
  testimonials: Testimonial[]
  box1Title: string
  box1Content: string
  box2Title: string
  box2Content: string
  contactsHeadline: string
  contactsCtaText: string
  linkBehance: string
  linkLinkedin: string
  linkWhatsapp: string
  linkFacebook: string
  linkInstagram: string
  footerCopyright: string
  footerNavProjects: string
  footerNavTestimonials: string
  footerNavAbout: string
}
