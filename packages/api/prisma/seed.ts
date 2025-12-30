import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'helloluis'
const DEFAULT_ACCOUNTS = ['dev', 'admin']

const DEFAULT_PORTFOLIO = {
  heroHeadline: 'heroHeadline',
  heroSubheadline: 'heroSubheadline',
  projects: [
    {
      id: '1',
      thumbnail: 'https://picsum.photos/200/300',
      photos: ['https://picsum.photos/200/300'],
      description: 'projectDescription',
      link: 'https://example.com',
    },
  ],
  testimonials: [
    {
      id: '1',
      content: 'testimonialContent',
      personName: 'testimonialPersonName',
    },
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
  footerNavAbout: 'footerNavAbout',
}

const main = async () => {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)

  // Create default accounts
  for (const accountId of DEFAULT_ACCOUNTS) {
    const existingUser = await prisma.user.findUnique({ where: { accountId } })
    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          accountId,
          password: hashedPassword,
        },
      })
      console.log('Created user:', user.accountId)
    } else {
      console.log('User already exists:', existingUser.accountId)
    }
  }

  // Create initial portfolio
  const existingPortfolio = await prisma.portfolio.findFirst()
  if (!existingPortfolio) {
    const portfolio = await prisma.portfolio.create({
      data: DEFAULT_PORTFOLIO,
    })
    console.log('Created portfolio:', portfolio.id)
  } else {
    console.log('Portfolio already exists:', existingPortfolio.id)
  }

  console.log('Seeding complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
