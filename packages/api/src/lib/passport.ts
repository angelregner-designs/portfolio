import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

// Local strategy for login
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return done(null, false, { message: 'Invalid credentials' })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return done(null, false, { message: 'Invalid credentials' })
      }

      return done(null, { id: user.id, email: user.email })
    } catch (error) {
      return done(error)
    }
  }
))

// JWT strategy for protected routes
passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromExtractors([
      // Try cookie first, then Authorization header
      (req) => req?.cookies?.token || null,
      ExtractJwt.fromAuthHeaderAsBearerToken()
    ]),
    secretOrKey: JWT_SECRET
  },
  async (payload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true }
      })
      if (!user) {
        return done(null, false)
      }
      return done(null, user)
    } catch (error) {
      return done(error)
    }
  }
))

export { JWT_SECRET }
export default passport
