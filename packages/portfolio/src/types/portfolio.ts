export type Project = {
  id: string
  title: string
  thumbnail: string
  photos: string[]
  description: string
  link: string
}

export type Testimonial = {
  id: string
  content: string
  personName: string
  company?: string
}

export type Portfolio = {
  id: string
  heroHeadline: string
  heroSubheadline: string
  projects: Project[]
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
