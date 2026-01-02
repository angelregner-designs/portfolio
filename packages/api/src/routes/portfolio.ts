import { type Request, type Response, Router } from 'express'
import { purgeCache } from '../lib/cloudflare.js'
import { prisma } from '../lib/prisma.js'
import { portfolioSchema } from '../lib/validation.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /portfolio - public
router.get('/portfolio', async (_req: Request, res: Response) => {
  try {
    const portfolio = await prisma.portfolio.findFirst()
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' })
    }
    res.set('Cache-Control', 'public, max-age=86400, s-maxage=604800') // 1d browser, 7d CDN
    return res.json(portfolio)
  } catch {
    return res.status(500).json({ error: 'Failed to fetch portfolio' })
  }
})

// POST /portfolio - requires auth, upserts entire portfolio
router.post('/portfolio', requireAuth, async (req: Request, res: Response) => {
  // Validate input
  const parseResult = portfolioSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parseResult.error.issues.map(e => ({ path: e.path.join('.'), message: e.message })),
    })
  }

  try {
    // Upsert: update if exists, create if not
    let portfolio = await prisma.portfolio.findFirst()
    if (portfolio) {
      portfolio = await prisma.portfolio.update({
        where: { id: portfolio.id },
        data: parseResult.data,
      })
    } else {
      portfolio = await prisma.portfolio.create({ data: parseResult.data })
    }

    purgeCache()
    return res.json(portfolio)
  } catch {
    return res.status(500).json({ error: 'Failed to update portfolio' })
  }
})

export default router
