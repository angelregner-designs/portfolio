export type Project = {
  id: string
  thumbnail: string
  photos: string[]
  description: string
  link: string
}

export type Testimonial = {
  id: string
  content: string
  personName: string
}

export type Portfolio = {
  id?: string
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

export const emptyPortfolio: Portfolio = {
  heroHeadline: '',
  heroSubheadline: '',
  projects: [],
  testimonials: [],
  box1Title: '',
  box1Content: '',
  box2Title: '',
  box2Content: '',
  contactsHeadline: '',
  contactsCtaText: '',
  linkBehance: '',
  linkLinkedin: '',
  linkWhatsapp: '',
  linkFacebook: '',
  linkInstagram: '',
  footerCopyright: '',
  footerNavProjects: '',
  footerNavTestimonials: '',
  footerNavAbout: '',
}
