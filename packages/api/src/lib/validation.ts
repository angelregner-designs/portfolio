import { z } from 'zod'

// Project schema
const projectSchema = z.object({
  id: z.string().min(1).max(50),
  title: z.string().max(200),
  thumbnail: z.string().max(500),
  photos: z.array(z.string().max(500)),
  description: z.string().max(5000),
  link: z.string().max(500),
})

// Testimonial schema
const testimonialSchema = z.object({
  id: z.string().min(1).max(50),
  content: z.string().max(5000),
  personName: z.string().max(100),
  company: z.string().max(100),
})

// Portfolio validation schema
export const portfolioSchema = z.object({
  heroHeadline: z.string().max(500),
  heroSubheadline: z.string().max(500),
  projects: z.array(projectSchema).max(50),
  testimonials: z.array(testimonialSchema).max(20),
  aboutMeTitle: z.string().max(200),
  aboutMeContent: z.string().max(10000),
  whyIDesignTitle: z.string().max(200),
  whyIDesignContent: z.string().max(10000),
  contactsHeadline: z.string().max(200),
  contactsCtaText: z.string().max(100),
  linkBehance: z.string().max(500),
  linkLinkedin: z.string().max(500),
  linkWhatsapp: z.string().max(500),
  linkFacebook: z.string().max(500),
  linkInstagram: z.string().max(500),
  linkEmail: z.string().max(500),
  footerCopyright: z.string().max(500),
  footerNavProjects: z.string().max(100),
  footerNavTestimonials: z.string().max(100),
  footerNavAbout: z.string().max(100),
  footerCtaText: z.string().max(100),
})

// Auth schemas
export const loginSchema = z.object({
  accountId: z.string().min(1).max(50),
  password: z.string().min(1).max(100),
})

// Password complexity: min 12 chars, uppercase, lowercase, number, special char
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(100),
  newPassword: z
    .string()
    .min(12, 'Password must be at least 12 characters')
    .max(100)
    .regex(
      passwordRegex,
      'Password must contain uppercase, lowercase, number, and special character',
    ),
})

// Upload params - alphanumeric, dash, underscore only (prevents path traversal)
export const projectIdSchema = z.string().regex(/^[a-zA-Z0-9_-]+$/, 'Invalid project ID format')

// Delete upload body
export const deleteUploadSchema = z.object({
  url: z.string().url().max(1000),
})
