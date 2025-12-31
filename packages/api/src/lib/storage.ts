import { Storage } from '@google-cloud/storage'
import { v4 as uuidv4 } from 'uuid'

// -----------------------------------------------------------------------------
// GCS STORAGE CLIENT
// -----------------------------------------------------------------------------
// Handles uploading and deleting files from Google Cloud Storage.
//
// Auth in different environments:
//   - Local dev: Uses GOOGLE_APPLICATION_CREDENTIALS env var (path to JSON key)
//   - Cloud Run: Uses Workload Identity (automatic, no key needed)
// -----------------------------------------------------------------------------

type UploadResult = {
  url: string
  filename: string
}

const storage = new Storage({
  projectId: process.env.GCS_PROJECT_ID,
})

const getBucket = () => {
  const bucketName = process.env.GCS_BUCKET_NAME
  if (!bucketName) {
    throw new Error('GCS_BUCKET_NAME environment variable not set')
  }
  return storage.bucket(bucketName)
}

// Upload a file to GCS
// Files are stored at: projects/{projectId}/{uuid}.{ext}
export const uploadFile = async (
  file: Express.Multer.File,
  projectId: string,
): Promise<UploadResult> => {
  const bucket = getBucket()
  const uuid = uuidv4()
  const ext = file.originalname.split('.').pop() || 'jpg'
  const filename = `projects/${projectId}/${uuid}.${ext}`

  const blob = bucket.file(filename)

  await blob.save(file.buffer, {
    contentType: file.mimetype,
    resumable: false, // Better performance for files <10MB
    metadata: {
      cacheControl: 'public, max-age=31536000', // 1 year cache for CDN
    },
  })

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`

  return { url: publicUrl, filename }
}

// Delete a file from GCS by its public URL
// Silently skips non-GCS URLs (e.g., external image URLs)
export const deleteFile = async (url: string): Promise<void> => {
  const bucket = getBucket()
  const bucketPrefix = `https://storage.googleapis.com/${bucket.name}/`

  // Skip if not a GCS URL from our bucket
  if (!url.startsWith(bucketPrefix)) {
    return
  }

  const filename = url.replace(bucketPrefix, '')

  try {
    await bucket.file(filename).delete()
  } catch (error) {
    // File may not exist, log but don't throw
    console.warn(`Failed to delete file: ${filename}`, error)
  }
}
