'use client'

import classNames from 'classnames'
import { useRef, useState } from 'react'

type ImageUploadProps = {
  value: string
  onChange: (url: string) => void
  onUpload: (file: File) => Promise<string | null>
  onDelete?: (url: string) => Promise<boolean>
  label: string
  disabled?: boolean
}

// Single image upload with preview, drag-drop, and URL input fallback
const ImageUpload = ({
  value,
  onChange,
  onUpload,
  onDelete,
  label,
  disabled = false,
}: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) return

    setUploading(true)
    const url = await onUpload(file)
    if (url) onChange(url)
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  const handleRemove = async () => {
    if (onDelete && value) {
      await onDelete(value)
    }
    onChange('')
  }

  return (
    <div className='space-y-2'>
      <span className='block text-sm font-medium'>{label}</span>

      {/* Preview with remove button */}
      {value && (
        <div className='relative inline-block'>
          <img src={value} alt='Preview' className='h-24 w-32 rounded-md border object-cover' />
          <button
            type='button'
            onClick={handleRemove}
            disabled={disabled}
            className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600'
          >
            ×
          </button>
        </div>
      )}

      {/* Upload zone */}
      <div
        className={classNames(
          'rounded-md border-2 border-dashed p-4 transition-colors',
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
          disabled && 'cursor-not-allowed opacity-50',
        )}
        onDragOver={e => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <p className='text-center text-sm text-gray-500'>Uploading...</p>
        ) : (
          <div className='flex flex-col gap-2'>
            <input
              type='text'
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder='Enter URL or upload image'
              disabled={disabled}
              className='w-full rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none'
            />
            <div className='flex items-center gap-2 text-xs text-gray-400'>
              <span>or</span>
              <button
                type='button'
                onClick={() => inputRef.current?.click()}
                disabled={disabled}
                className='text-blue-600 hover:underline'
              >
                choose file
              </button>
              <span>or drag & drop</span>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={e => {
            const file = e.target.files?.[0]
            if (file) handleFileChange(file)
            e.target.value = '' // Reset to allow same file selection
          }}
        />
      </div>
    </div>
  )
}

export default ImageUpload
