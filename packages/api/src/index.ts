import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import passport from './lib/passport.js'
import { prisma } from './lib/prisma.js'
import authRoutes from './routes/auth.js'
import portfolioRoutes from './routes/portfolio.js'
import uploadRoutes from './routes/upload.js'

const app = express()
const PORT = process.env.PORT || 3001

// CORS configuration
// In production, CORS_ORIGINS env var contains comma-separated allowed origins
// In development, defaults to localhost
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3002']

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
)
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

// Routes
app.use(authRoutes)
app.use(portfolioRoutes)
app.use(uploadRoutes)

// Health check
// Pings Mongo so Cloud Scheduler hits (see terraform keep-alive job) count as
// cluster activity, keeping the Atlas M0 free-tier cluster from auto-pausing.
app.get('/health', async (_req, res) => {
  await prisma.$runCommandRaw({ ping: 1 })
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Version info - injected at Docker build time
app.get('/version', (_req, res) => {
  res.json({
    app: 'api',
    version: process.env.BUILD_SHA?.slice(0, 7) || 'dev',
    buildTimestamp: process.env.BUILD_TIMESTAMP || new Date().toISOString(),
    environment: process.env.NODE_ENV === 'production' ? 'prod' : 'dev',
  })
})

// Graceful shutdown
const shutdown = async () => {
  await prisma.$disconnect()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

// Start server
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
})
