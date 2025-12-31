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

// Middleware
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
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
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
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
