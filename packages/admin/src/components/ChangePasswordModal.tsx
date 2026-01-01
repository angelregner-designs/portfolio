'use client'

import { cn } from '@angel-portfolio/shared'
import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type ChangePasswordModalProps = {
  onClose: () => void
}

const ChangePasswordModal = ({ onClose }: ChangePasswordModalProps) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      toast.success('Password changed successfully')
      setTimeout(onClose, 1500)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('fixed inset-0', 'flex items-center justify-center', 'bg-black/50', 'z-50')}>
      <div className={cn('w-full max-w-md', 'mx-4 p-6', 'bg-white', 'rounded-lg shadow-xl')}>
        <h2 className={cn('mb-4', 'text-xl font-semibold')}>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='currentPassword' className={cn('block', 'mb-2', 'text-sm font-medium')}>
              Current Password
            </label>
            <input
              id='currentPassword'
              type='password'
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
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
            <label htmlFor='newPassword' className={cn('block', 'mb-2', 'text-sm font-medium')}>
              New Password (min 8 characters)
            </label>
            <input
              id='newPassword'
              type='password'
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
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
            <label htmlFor='confirmPassword' className={cn('block', 'mb-2', 'text-sm font-medium')}>
              Confirm New Password
            </label>
            <input
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
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
          <div className='flex gap-3'>
            <button
              type='submit'
              disabled={loading}
              className={cn(
                'flex-1',
                'py-2 px-4',
                'font-medium',
                'text-white bg-blue-600',
                'rounded-md',
                'hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-wait',
              )}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type='button'
              onClick={onClose}
              className={cn(
                'px-4 py-2',
                'border border-gray-300',
                'rounded-md',
                'hover:bg-gray-50',
              )}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
