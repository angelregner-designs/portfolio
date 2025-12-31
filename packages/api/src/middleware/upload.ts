import type { Request } from 'express'
import multer from 'multer'

// -----------------------------------------------------------------------------
// MULTER UPLOAD MIDDLEWARE
// -----------------------------------------------------------------------------
// Handles multipart form data (file uploads).
// Files are stored in memory buffer, then passed to GCS for storage.
// -----------------------------------------------------------------------------

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_FILES = 20

// Use memory storage - files buffered in memory, then uploaded to GCS
const storage = multer.memoryStorage()

// Only allow image files
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: ${ALLOWED_MIMES.join(', ')}`))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: MAX_FILES,
  },
})
