'use client'

import { cn } from '@angel-portfolio/shared'
import { useRef, useState } from 'react'

type MultiImageUploadProps = {
  values: string[]
  onChange: (urls: string[]) => void
  onUpload: (files: File[]) => Promise<string[]>
  onDelete?: (url: string) => Promise<boolean>
  label: string
  disabled?: boolean
}

// Multi-image upload with previews, drag-drop, and URL input
const MultiImageUpload = ({
  values,
  onChange,
  onUpload,
  onDelete,
  label,
  disabled = false,
}: MultiImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const handleFilesChange = async (fileList: FileList) => {
    const imageFiles = Array.from(fileList).filter(f => f.type.startsWith('image/'))
    if (imageFiles.length === 0) return

    setUploading(true)
    const urls = await onUpload(imageFiles)
    onChange([...values, ...urls])
    setUploading(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFilesChange(e.dataTransfer.files)
  }

  const handleRemove = async (index: number) => {
    const url = values[index]
    if (onDelete) await onDelete(url)
    onChange(values.filter((_, i) => i !== index))
  }

  const handleUrlChange = (index: number, newUrl: string) => {
    onChange(values.map((url, i) => (i === index ? newUrl : url)))
  }

  const addUrlField = () => {
    onChange([...values, ''])
  }

  return (
    <div className='space-y-2'>
      <span className='block text-sm font-medium'>{label}</span>

      {/* Existing images list */}
      {values.length > 0 && (
        <div className='space-y-2'>
          {values.map((url, index) => (
            <div key={`${index}-${url}`} className='flex items-center gap-2'>
              {url && (
                <div
                  className={cn('h-12 w-16', 'flex-shrink-0', 'border', 'rounded overflow-hidden')}
                >
                  <img src={url} alt='' className='h-full w-full object-cover' />
                </div>
              )}
              <input
                type='text'
                value={url}
                onChange={e => handleUrlChange(index, e.target.value)}
                placeholder='Image URL'
                disabled={disabled}
                className={cn(
                  'flex-1',
                  'px-2 py-1',
                  'text-sm',
                  'border border-gray-300',
                  'rounded',
                  'focus:border-blue-500 focus:outline-none',
                )}
              />
              <button
                type='button'
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className={cn('text-sm', 'text-red-500', 'hover:text-red-700 hover:underline')}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      <div
        className={cn(
          'rounded-md border-2 border-dashed p-4 transition-colors',
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
          disabled && 'opacity-50',
        )}
        onDragOver={e => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <p className={cn('text-center text-sm', 'text-gray-500')}>Uploading...</p>
        ) : (
          <div className={cn('flex items-center justify-center', 'gap-4')}>
            <button
              type='button'
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              className='text-sm text-blue-600 hover:underline'
            >
              Upload images
            </button>
            <span className='text-gray-400'>|</span>
            <button
              type='button'
              onClick={addUrlField}
              disabled={disabled}
              className='text-sm text-gray-600 hover:underline'
            >
              Add URL
            </button>
            <span className='text-xs text-gray-400'>or drag & drop</span>
          </div>
        )}
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          multiple
          className='hidden'
          onChange={e => {
            if (e.target.files) handleFilesChange(e.target.files)
            e.target.value = ''
          }}
        />
      </div>
    </div>
  )
}

export default MultiImageUpload
