// Server-side env for Docker, fallback for local dev
const API_URL = process.env.API_URL || 'http://localhost:3001'

interface PortfolioPage {
  id: string
  title: string
}

const fetchPortfolio = async (): Promise<PortfolioPage | null> => {
  try {
    const res = await fetch(`${API_URL}/portfolio-page`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const HomePage = async () => {
  const portfolio = await fetchPortfolio()

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>{portfolio?.title || 'Loading...'}</h1>
      {!portfolio && <p>Failed to load portfolio data</p>}
    </main>
  )
}

export default HomePage
