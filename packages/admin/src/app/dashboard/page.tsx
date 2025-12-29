'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import ChangePasswordModal from '@/components/ChangePasswordModal'

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
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch(`${API_URL}/user`, { credentials: 'include' })
        if (!userRes.ok) {
          router.push('/')
          return
        }
        const userData = await userRes.json()
        setUser(userData.user)

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
    return (
      <main className="p-8">
        <p className="text-gray-600">Loading...</p>
      </main>
    )
  }

  return (
    <main className="max-w-2xl mx-auto p-8">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{user?.accountId}</span>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Change Password
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Portfolio</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {message && (
            <p className={`text-sm mb-4 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
          <button
            type="submit"
            disabled={saving}
            className="py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-wait"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </section>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </main>
  )
}

export default DashboardPage
