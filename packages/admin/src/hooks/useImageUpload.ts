import { useState } from 'react'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type UploadState = {
  uploading: boolean
}

export const useImageUpload = () => {
  const [state, setState] = useState<UploadState>({
    uploading: false,
  })

  const uploadThumbnail = async (projectId: string, file: File): Promise<string | null> => {
    setState({ uploading: true })

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
      setState({ uploading: false })
      toast.success('Thumbnail uploaded')
      return data.url
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed'
      setState({ uploading: false })
      toast.error(message)
      return null
    }
  }

  const uploadPhotos = async (projectId: string, files: File[]): Promise<string[]> => {
    setState({ uploading: true })

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
      setState({ uploading: false })
      toast.success(`${files.length} photo${files.length > 1 ? 's' : ''} uploaded`)
      return data.urls
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed'
      setState({ uploading: false })
      toast.error(message)
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
      if (res.ok) {
        toast.success('Image deleted')
        return true
      }
      toast.error('Failed to delete image')
      return false
    } catch {
      toast.error('Failed to delete image')
      return false
    }
  }

  return { ...state, uploadThumbnail, uploadPhotos, deleteImage }
}
