import { Request, Response, NextFunction } from 'express'
import passport from '../lib/passport.js'

export interface AuthUser {
  id: string
  email: string
}

export interface AuthRequest extends Request {
  user?: AuthUser
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: AuthUser | false) => {
    if (err) {
      return res.status(500).json({ error: 'Authentication error' })
    }
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    (req as AuthRequest).user = user
    next()
  })(req, res, next)
}
