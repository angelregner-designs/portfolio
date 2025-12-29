import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'helloluis'
const DEFAULT_ACCOUNTS = ['dev', 'admin']

const main = async () => {
  console.log('Seeding database...')

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)

  // Create default accounts
  for (const accountId of DEFAULT_ACCOUNTS) {
    const existingUser = await prisma.user.findUnique({ where: { accountId } })
    if (!existingUser) {
      const user = await prisma.user.create({
        data: {
          accountId,
          password: hashedPassword
        }
      })
      console.log('Created user:', user.accountId)
    } else {
      console.log('User already exists:', existingUser.accountId)
    }
  }

  // Create initial portfolio page
  const existingPage = await prisma.portfolioPage.findFirst()
  if (!existingPage) {
    const page = await prisma.portfolioPage.create({
      data: {
        title: 'Welcome to My Portfolio'
      }
    })
    console.log('Created portfolio page:', page.title)
  } else {
    console.log('Portfolio page already exists:', existingPage.title)
  }

  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
