import type { NextFunction, Request, Response } from 'express'
import passport from '../lib/passport.js'

export type AuthUser = {
  id: string
  accountId: string
}

export type AuthRequest = Request & {
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
    ;(req as AuthRequest).user = user
    return next()
  })(req, res, next)
}
