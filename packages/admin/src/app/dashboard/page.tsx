'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface User {
  id: string
  accountId: string
}

interface PortfolioPage {
  id: string
  title: string
}

const DashboardPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [portfolio, setPortfolio] = useState<PortfolioPage | null>(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check auth
        const userRes = await fetch(`${API_URL}/user`, { credentials: 'include' })
        if (!userRes.ok) {
          router.push('/')
          return
        }
        const userData = await userRes.json()
        setUser(userData.user)

        // Fetch portfolio
        const portfolioRes = await fetch(`${API_URL}/portfolio-page`, { credentials: 'include' })
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json()
          setPortfolio(portfolioData)
          setTitle(portfolioData.title)
        }
      } catch {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch(`${API_URL}/portfolio-page`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title })
      })

      if (!res.ok) throw new Error('Failed to save')

      const data = await res.json()
      setPortfolio(data)
      setMessage('Saved successfully!')
    } catch {
      setMessage('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    router.push('/')
  }

  if (loading) {
    return <main style={{ padding: '2rem' }}>Loading...</main>
  }

  return (
    <main style={{ padding: '2rem', maxWidth: 600 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>{user?.accountId}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section>
        <h2>Edit Portfolio</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>
          {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}
          <button
            type="submit"
            disabled={saving}
            style={{ padding: '0.5rem 1rem', cursor: saving ? 'wait' : 'pointer' }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default DashboardPage
