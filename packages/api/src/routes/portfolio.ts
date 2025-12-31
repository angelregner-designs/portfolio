import { type Request, type Response, Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /portfolio - public
router.get('/portfolio', async (_req: Request, res: Response) => {
  try {
    const portfolio = await prisma.portfolio.findFirst()
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }
    return res.json(portfolio)
  } catch {
    return res.status(500).json({ error: 'Failed to fetch portfolio' })
  }
})

// POST /portfolio - requires auth, upserts entire portfolio
router.post('/portfolio', requireAuth, async (req: Request, res: Response) => {
  try {
    const {
      heroHeadline,
      heroSubheadline,
      projects,
      testimonials,
      aboutMeTitle,
      aboutMeContent,
      whyIDesignTitle,
      whyIDesignContent,
      contactsHeadline,
      contactsCtaText,
      linkBehance,
      linkLinkedin,
      linkWhatsapp,
      linkFacebook,
      linkInstagram,
      linkEmail,
      footerCopyright,
      footerNavProjects,
      footerNavTestimonials,
      footerNavAbout,
      footerCtaText,
    } = req.body

    const data = {
      heroHeadline,
      heroSubheadline,
      projects,
      testimonials,
      aboutMeTitle,
      aboutMeContent,
      whyIDesignTitle,
      whyIDesignContent,
      contactsHeadline,
      contactsCtaText,
      linkBehance,
      linkLinkedin,
      linkWhatsapp,
      linkFacebook,
      linkInstagram,
      linkEmail,
      footerCopyright,
      footerNavProjects,
      footerNavTestimonials,
      footerNavAbout,
      footerCtaText,
    }

    // Upsert: update if exists, create if not
    let portfolio = await prisma.portfolio.findFirst()
    if (portfolio) {
      portfolio = await prisma.portfolio.update({
        where: { id: portfolio.id },
        data,
      })
    } else {
      portfolio = await prisma.portfolio.create({ data })
    }

    return res.json(portfolio)
  } catch {
    return res.status(500).json({ error: 'Failed to update portfolio' })
  }
})

export default router
