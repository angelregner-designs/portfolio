import { type Request, type Response, Router } from 'express'
import { purgeCache } from '../lib/cloudflare.js'
import { deleteFile, uploadFile } from '../lib/storage.js'
import { deleteUploadSchema, projectIdSchema } from '../lib/validation.js'
import { requireAuth } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'

// -----------------------------------------------------------------------------
// UPLOAD ROUTES
// -----------------------------------------------------------------------------
// POST /upload/thumbnail/:projectId - Upload single thumbnail image
// POST /upload/photos/:projectId    - Upload multiple project photos
// DELETE /upload                    - Delete a file by URL
//
// All routes require authentication.
// -----------------------------------------------------------------------------

const router = Router()

// Upload single thumbnail for a project
router.post(
  '/upload/thumbnail/:projectId',
  requireAuth,
  upload.single('thumbnail'),
  async (req: Request, res: Response) => {
    // Validate projectId to prevent path traversal
    const projectIdResult = projectIdSchema.safeParse(req.params.projectId)
    if (!projectIdResult.success) {
      return res.status(400).json({ error: 'Invalid project ID format' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    try {
      const result = await uploadFile(req.file, projectIdResult.data)
      purgeCache()
      return res.json({ url: result.url })
    } catch (error) {
      console.error('Thumbnail upload error:', error instanceof Error ? error.message : 'Unknown')
      return res.status(500).json({ error: 'Upload failed' })
    }
  },
)

// Upload multiple photos for a project
router.post(
  '/upload/photos/:projectId',
  requireAuth,
  upload.array('photos', 20),
  async (req: Request, res: Response) => {
    // Validate projectId to prevent path traversal
    const projectIdResult = projectIdSchema.safeParse(req.params.projectId)
    if (!projectIdResult.success) {
      return res.status(400).json({ error: 'Invalid project ID format' })
    }

    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' })
    }

    try {
      const results = await Promise.all(files.map(file => uploadFile(file, projectIdResult.data)))
      purgeCache()
      return res.json({ urls: results.map(r => r.url) })
    } catch (error) {
      console.error('Photos upload error:', error instanceof Error ? error.message : 'Unknown')
      return res.status(500).json({ error: 'Upload failed' })
    }
  },
)

// Delete a file by its URL
router.delete('/upload', requireAuth, async (req: Request, res: Response) => {
  // Validate URL format
  const urlResult = deleteUploadSchema.safeParse(req.body)
  if (!urlResult.success) {
    return res.status(400).json({ error: 'Invalid URL format' })
  }

  try {
    await deleteFile(urlResult.data.url)
    purgeCache()
    return res.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error instanceof Error ? error.message : 'Unknown')
    return res.status(500).json({ error: 'Delete failed' })
  }
})

export default router
