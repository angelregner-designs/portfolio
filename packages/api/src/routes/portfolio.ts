import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /portfolio-page - public
router.get('/portfolio-page', async (_req: Request, res: Response) => {
  try {
    const page = await prisma.portfolioPage.findFirst()
    if (!page) {
      return res.status(404).json({ error: 'Portfolio page not found' })
    }
    res.json(page)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio page' })
  }
})

// POST /portfolio-page - requires auth
router.post('/portfolio-page', requireAuth, async (req: Request, res: Response) => {
  try {
    const { title } = req.body
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required' })
    }

    // Upsert: update if exists, create if not
    let page = await prisma.portfolioPage.findFirst()
    if (page) {
      page = await prisma.portfolioPage.update({
        where: { id: page.id },
        data: { title }
      })
    } else {
      page = await prisma.portfolioPage.create({
        data: { title }
      })
    }

    res.json(page)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update portfolio page' })
  }
})

export default router
