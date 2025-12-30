import { PortfolioPage } from '@/components/PortfolioPage'
import { HARDCODED_PORTFOLIO } from '@/data/portfolio'
import type { Portfolio } from '@/types/portfolio'

// Toggle this to switch between hardcoded data and API fetch
const USE_HARDCODED_DATA = true

const API_URL = process.env.API_URL || 'http://localhost:3001'

const fetchPortfolio = async (): Promise<Portfolio | null> => {
  try {
    const res = await fetch(`${API_URL}/portfolio`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const HomePage = async () => {
  const portfolio = USE_HARDCODED_DATA ? HARDCODED_PORTFOLIO : await fetchPortfolio()

  if (!portfolio) {
    return (
      <main className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Failed to load portfolio data</p>
      </main>
    )
  }

  return <PortfolioPage portfolio={portfolio} />
}

export default HomePage
