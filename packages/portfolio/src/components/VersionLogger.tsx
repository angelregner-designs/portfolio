'use client'

import { useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const VersionLogger = () => {
  useEffect(() => {
    const version = process.env.NEXT_PUBLIC_BUILD_SHA?.slice(0, 7) || 'dev'
    const timestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || 'local'
    const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'

    console.log(`[Version] portfolio @ ${version} (${timestamp}) [${env}]`)

    // Fetch API version
    fetch(`${API_URL}/version`)
      .then(res => res.json())
      .then(data => console.log(`[Version] API @ ${data.version} (${data.buildTimestamp})`))
      .catch(() => console.log('[Version] API unreachable'))
  }, [])

  return null
}
