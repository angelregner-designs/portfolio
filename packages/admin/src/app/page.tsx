'use client'

import { cn } from '@angel-portfolio/shared'
import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const LoginPage = () => {
  const router = useRouter()
  const [accountId, setAccountId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ accountId, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Login failed')
      }

      router.push('/dashboard')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={cn('max-w-md', 'mx-auto mt-24 p-8')}>
      <div className={cn('p-8', 'bg-white', 'rounded-lg shadow-md')}>
        <h1 className={cn('mb-6', 'text-2xl font-bold', 'text-center')}>Admin Login</h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='accountId' className={cn('block', 'mb-2', 'text-sm font-medium')}>
              Account ID
            </label>
            <input
              id='accountId'
              type='text'
              value={accountId}
              onChange={e => setAccountId(e.target.value)}
              required
              className={cn(
                'w-full',
                'px-3 py-2',
                'border border-gray-300',
                'rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              )}
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='password' className={cn('block', 'mb-2', 'text-sm font-medium')}>
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={cn(
                'w-full',
                'px-3 py-2',
                'border border-gray-300',
                'rounded-md',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              )}
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className={cn(
              'w-full',
              'py-2 px-4',
              'font-medium',
              'text-white bg-blue-600',
              'rounded-md',
              'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-wait',
            )}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  )
}

export default LoginPage
