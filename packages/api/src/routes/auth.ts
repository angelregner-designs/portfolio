import { Router, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import passport, { JWT_SECRET } from '../lib/passport.js'
import { requireAuth, AuthRequest, AuthUser } from '../middleware/auth.js'

const router = Router()

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

// POST /login
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err: Error | null, user: AuthUser | false, info: { message: string } | undefined) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed' })
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Invalid credentials' })
    }

    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })
    res.cookie('token', token, COOKIE_OPTIONS)
    res.json({ user })
  })(req, res, next)
})

// POST /logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token', COOKIE_OPTIONS)
  res.json({ success: true })
})

// GET /user
router.get('/user', requireAuth, (req: Request, res: Response) => {
  res.json({ user: (req as AuthRequest).user })
})

export default router
