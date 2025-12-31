import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type UploadState = {
  uploading: boolean
  error: string | null
}

export const useImageUpload = () => {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    error: null,
  })

  const uploadThumbnail = async (projectId: string, file: File): Promise<string | null> => {
    setState({ uploading: true, error: null })

    try {
      const formData = new FormData()
      formData.append('thumbnail', file)

      const res = await fetch(`${API_URL}/upload/thumbnail/${projectId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed')
      }

      const data = await res.json()
      setState({ uploading: false, error: null })
      return data.url
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed'
      setState({ uploading: false, error: message })
      return null
    }
  }

  const uploadPhotos = async (projectId: string, files: File[]): Promise<string[]> => {
    setState({ uploading: true, error: null })

    try {
      const formData = new FormData()
      files.forEach(file => formData.append('photos', file))

      const res = await fetch(`${API_URL}/upload/photos/${projectId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Upload failed')
      }

      const data = await res.json()
      setState({ uploading: false, error: null })
      return data.urls
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed'
      setState({ uploading: false, error: message })
      return []
    }
  }

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      return res.ok
    } catch {
      return false
    }
  }

  return { ...state, uploadThumbnail, uploadPhotos, deleteImage }
}
