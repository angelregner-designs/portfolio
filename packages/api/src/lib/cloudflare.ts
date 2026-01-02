// Cloudflare CDN cache purge utility
// Silently skips if credentials not configured (dev environment)
// Only purges dynamic content URLs, static assets stay cached (content-hashed)

export const purgeCache = (): void => {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const portfolioUrl = process.env.PORTFOLIO_URL
  const apiUrl = process.env.API_URL

  // Skip in dev (credentials not configured)
  if (!zoneId || !apiToken) return

  // Fail loudly if URLs missing in prod
  if (!portfolioUrl || !apiUrl) {
    console.error('Cache purge failed: PORTFOLIO_URL and API_URL env vars required')
    return
  }

  const contentUrls = [`${apiUrl}/portfolio`, `${portfolioUrl}/`, `${portfolioUrl}/about`]

  fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: contentUrls }),
  }).catch(err => console.error('Cloudflare cache purge failed:', err))
}
