'use client'

import ChangePasswordModal from '@/components/ChangePasswordModal'
import BoxSection from '@/components/portfolio/BoxSection'
import ContactsSection from '@/components/portfolio/ContactsSection'
import FooterSection from '@/components/portfolio/FooterSection'
import HeroSection from '@/components/portfolio/HeroSection'
import ProjectsSection from '@/components/portfolio/ProjectsSection'
import TestimonialsSection from '@/components/portfolio/TestimonialsSection'
import { type Portfolio, type Project, type Testimonial, emptyPortfolio } from '@/types/portfolio'
import { useRouter } from 'next/navigation'
import { type FormEvent, useEffect, useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface User {
  id: string
  accountId: string
}

const DashboardPage = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio>(emptyPortfolio)
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

        const portfolioRes = await fetch(`${API_URL}/portfolio`, { credentials: 'include' })
        if (portfolioRes.ok) {
          const portfolioData = await portfolioRes.json()
          setPortfolio(portfolioData)
        }
      } catch {
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const updateField = <K extends keyof Portfolio>(field: K, value: Portfolio[K]) => {
    setPortfolio(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch(`${API_URL}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(portfolio),
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
      credentials: 'include',
    })
    router.push('/')
  }

  if (loading) {
    return (
      <main className='p-8'>
        <p className='text-gray-600'>Loading...</p>
      </main>
    )
  }

  return (
    <main className='max-w-4xl mx-auto p-8'>
      <header className='flex justify-between items-center mb-8 pb-4 border-b border-gray-200'>
        <h1 className='text-2xl font-bold'>Dashboard</h1>
        <div className='flex items-center gap-4'>
          <span className='text-gray-600'>{user?.accountId}</span>
          <button
            type='button'
            onClick={() => setShowPasswordModal(true)}
            className='px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
          >
            Change Password
          </button>
          <button
            type='button'
            onClick={handleLogout}
            className='px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50'
          >
            Logout
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit}>
        <HeroSection
          heroHeadline={portfolio.heroHeadline}
          heroSubheadline={portfolio.heroSubheadline}
          onChange={(field, value) => updateField(field, value)}
        />

        <ProjectsSection
          projects={portfolio.projects}
          onChange={(projects: Project[]) => updateField('projects', projects)}
        />

        <TestimonialsSection
          testimonials={portfolio.testimonials}
          onChange={(testimonials: Testimonial[]) => updateField('testimonials', testimonials)}
        />

        <BoxSection
          box1Title={portfolio.box1Title}
          box1Content={portfolio.box1Content}
          box2Title={portfolio.box2Title}
          box2Content={portfolio.box2Content}
          onChange={(field, value) => updateField(field, value)}
        />

        <ContactsSection
          contactsHeadline={portfolio.contactsHeadline}
          contactsCtaText={portfolio.contactsCtaText}
          linkBehance={portfolio.linkBehance}
          linkLinkedin={portfolio.linkLinkedin}
          linkWhatsapp={portfolio.linkWhatsapp}
          linkFacebook={portfolio.linkFacebook}
          linkInstagram={portfolio.linkInstagram}
          onChange={(field, value) => updateField(field, value)}
        />

        <FooterSection
          footerCopyright={portfolio.footerCopyright}
          footerNavProjects={portfolio.footerNavProjects}
          footerNavTestimonials={portfolio.footerNavTestimonials}
          footerNavAbout={portfolio.footerNavAbout}
          onChange={(field, value) => updateField(field, value)}
        />

        {message && (
          <p
            className={`text-sm mb-4 ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}
          >
            {message}
          </p>
        )}

        <div className='sticky bottom-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200'>
          <button
            type='submit'
            disabled={saving}
            className='w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-wait'
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </main>
  )
}

export default DashboardPage
