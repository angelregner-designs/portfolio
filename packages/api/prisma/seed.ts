import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'helloluis'
const DEFAULT_ACCOUNTS = ['dev', 'admin']

const DEFAULT_PORTFOLIO = {
  heroHeadline: 'I design with intention, balancing creative expression with clarity and purpose.',
  heroSubheadline: 'Angel Regner | Product, Brand, and Digital Designer',
  projects: [
    {
      id: '1',
      title: 'Website Designs for Luxury Homes | Villa Vision Builder',
      thumbnail: '/project1.png',
      photos: [],
      description: '',
      link: '',
    },
    {
      id: '2',
      title: 'Logo and Brand Concepts | MNCH',
      thumbnail: '/project2.png',
      photos: [],
      description: '',
      link: 'https://www.instagram.com/p/DOT55FFk1ch/?img_index=1',
    },
    {
      id: '3',
      title: 'Logo and Brand Concepts | NexaReach',
      thumbnail: '/project3.png',
      photos: [],
      description: '',
      link: 'https://www.instagram.com/p/DOG-tyUAcB3/?img_index=1',
    },
    {
      id: '4',
      title: 'Brand Refresh for a Wellness and Coaching Brand | Lo Rox',
      thumbnail: '/project4.png',
      photos: [],
      description: '',
      link: 'https://laurenroxburgh.com/',
    },
    {
      id: '5',
      title: 'UI UX Design & Ads Assets for a Real Estate SaaS App | Propelio',
      thumbnail: '/project5.png',
      photos: [],
      description: '',
      link: 'https://www.propelio.com/',
    },
    {
      id: '6',
      title: 'Brand Identity Designs | Angel Regner',
      thumbnail: '/project6.png',
      photos: [],
      description: '',
      link: '',
    },
    {
      id: '7',
      title: 'Brand Concepts | Bloom Social',
      thumbnail: '/project7.png',
      photos: [],
      description: '',
      link: 'https://www.instagram.com/p/DOMdalCk5Vm/',
    },
    {
      id: '8',
      title: 'Logo, Landing Page, and Email Design | MUM BRAIN',
      thumbnail: '/project8.png',
      photos: [],
      description: '',
      link: 'https://mumbrain.app/',
    },
    {
      id: '9',
      title: 'Branding Design & Print Assets for Cookie Brand | The Chunks',
      thumbnail: '/project9.png',
      photos: [],
      description: '',
      link: 'https://www.behance.net/gallery/231874015/The-Chunks-Brand-Identity-Design',
    },
    {
      id: '10',
      title: 'Branding & Product Design | AKOKITA',
      thumbnail: '/project10.png',
      photos: [],
      description: '',
      link: 'https://www.instagram.com/akoki.ta/',
    },
  ],
  testimonials: [
    {
      id: '1',
      content: `In less than 18 months, she demonstrated extraordinary growth, rising from a trainee under a seasoned professional with 20 years of experience to leading the entire Design Department. She not only mastered her craft but also built and trained her own team, established a cohesive design language, and implemented clear processes that elevated both quality and accountability.

Her leadership style blends high standards with strong mentorship, ensuring her team consistently delivered exceptional work. She is deeply self-motivated, continuously studying and refining her skills, and her commitment to excellence is evident in every project she touches. She holds herself and others accountable, setting the bar high for design quality and execution.

Her ability to transition from trainee to department head in such a short period of time is a testament to her intelligence, dedication, and natural leadership ability. She is not only a stellar designer but also a strategic thinker who understands how to scale a team, define processes, and drive results. Any organization would be fortunate to have her—she is, without question, one of the best in her profession.`,
      personName: 'Daniel Moore',
      company: 'Propelio',
    },
    {
      id: '2',
      content: `Working with Angelica has been the best decision we've made in our business. She's been an integral part of our team for months, and we've loved every bit of it. Angelica is hardworking, communicates clearly, stays organized, and consistently delivers thoughtful updates.

What really sets her apart is her ability to understand a brand and translate a complicated vision it into beautiful, functional design. She has a natural talent for creating stunning website designs from scratch that truly bring a business to life. Angelica also adapts quickly to our company's processes and structure, learning fast and always striving for excellence.

Without a doubt, I would highly recommend Angelica to anyone looking for a talented, reliable, and creative designer. She's a joy to work with and a real asset to any project.`,
      personName: 'Jack',
      company: 'Villa Vision Builders',
    },
    {
      id: '3',
      content:
        'Working with Angelica and her team has been an absolute pleasure for us. Their attention to detail, responsiveness and collaboration has been fantastic - so much so that we are bringing Angel on in an ongoing capacity to handle our design needs going forward. I would recommend them to anyone looking for a great designer and a very professional collaborator.',
      personName: 'Gus Roxburgh',
      company: 'LO ROX Studio',
    },
  ],
  aboutMeTitle: 'About Me',
  aboutMeContent: `I'm an all-around creative with over 4 years of experience working remotely.

I started my career as a social media designer, where I learned the fundamentals of graphic design and visual storytelling. I then spent more than 3 years as a Product (UI/UX) Designer, which taught me how to collaborate effectively, lead projects, work closely with CEOs and department heads, and manage both teams and timelines.

Now, I work as a creative all-rounder, designing websites, emails, and brand identities for clients across different industries. I combine design thinking with creativity to help brands communicate clearly and meaningfully through visuals that connect.`,
  whyIDesignTitle: 'Why I Design',
  whyIDesignContent: `I grew up talking to myself, and myself always listened.
Maybe that's why I never craved being heard. I often wonder if people have someone who truly listens to them.

When people talk to me, I listen. I empathize.
Over time, I noticed that when I look people in the eye, I start seeing their stories.
They open up, even total strangers. And I like that.
They feel safe with me, and that feels like peace.

I know I can't live many lives, but I get to hear them, learn from them, and somehow bring them to life through design.

Early in my career, I worked with a client who was frustrated that his ideas never matched what was being built. I wasn't the lead designer then, but I saw how much it mattered to him. I promised myself that if I ever got the chance, I would help people like him finally see their vision come to life.

Eventually, I got that chance. And I did. He was happy. I understood what he wanted and turned it into something that worked.

I've done the same for others since. A crafter who wanted a logo to honor her late lola. A fitness expert who wanted her brand to feel magnetic.
The crafter didn't have a photo with her lola, so I drew them together in a simple outline. She said she never thought she'd have a picture with her again.
For the fitness expert, I helped her see that a brand goes beyond color. I added textures and direction that matched her energy. She told me, "I feel so seen."

That's when I knew. This is what I love doing.
I design to help people feel seen, understood, and proud of what they create.`,
  contactsHeadline: "Let's Connect",
  contactsCtaText: "Let's Work Together",
  linkBehance: 'https://www.behance.net/angelicaregner',
  linkLinkedin: 'https://www.linkedin.com/in/angelicaregner',
  linkWhatsapp: 'https://wa.me/639361822966',
  linkFacebook: 'https://www.facebook.com/share/1896syxpiw/?mibextid=wwXIfr',
  linkInstagram: 'https://www.instagram.com/angelregne.r?igsh=MXRjNTZ4dG83Z3Q3bw==',
  linkEmail: 'mailto:angelicaregner00@gmail.com',
  footerCopyright: '© 2025 Angel Regner • All Rights Reserved • Great design begins with empathy.',
  footerNavProjects: 'Client Works',
  footerNavTestimonials: 'Testimonials',
  footerNavAbout: 'About',
  footerCtaText: "Let's Work Together",
}

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
          password: hashedPassword,
        },
      })
      console.log('Created user:', user.accountId)
    } else {
      console.log('User already exists:', existingUser.accountId)
    }
  }

  // Create initial portfolio
  const existingPortfolio = await prisma.portfolio.findFirst()
  if (!existingPortfolio) {
    const portfolio = await prisma.portfolio.create({
      data: DEFAULT_PORTFOLIO,
    })
    console.log('Created portfolio:', portfolio.id)
  } else {
    console.log('Portfolio already exists:', existingPortfolio.id)
  }

  console.log('Seeding complete!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
