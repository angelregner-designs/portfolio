import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const main = async () => {
  console.log('Seeding database...')

  // Create default user (skip if exists)
  const existingUser = await prisma.user.findUnique({ where: { email: 'admin@test.com' } })
  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('password123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: hashedPassword
      }
    })
    console.log('Created user:', user.email)
  } else {
    console.log('User already exists:', existingUser.email)
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
