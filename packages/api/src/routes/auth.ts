import bcrypt from 'bcryptjs'
import { type NextFunction, type Request, type Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import passport, { JWT_SECRET } from '../lib/passport.js'
import { prisma } from '../lib/prisma.js'
import { type AuthRequest, type AuthUser, requireAuth } from '../middleware/auth.js'

const router = Router()

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

// POST /login
router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    { session: false },
    (err: Error | null, user: AuthUser | false, info: { message: string } | undefined) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' })
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || 'Invalid credentials' })
      }

      const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })
      res.cookie('token', token, COOKIE_OPTIONS)
      return res.json({ user })
    },
  )(req, res, next)
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

// POST /change-password
router.post('/change-password', requireAuth, async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body
  const user = (req as AuthRequest).user

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password required' })
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' })
  }

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) {
      return res.status(404).json({ error: 'User not found' })
    }

    const isValid = await bcrypt.compare(currentPassword, dbUser.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    })

    return res.json({ success: true })
  } catch {
    return res.status(500).json({ error: 'Failed to change password' })
  }
})

export default router
