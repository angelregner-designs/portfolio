// Cloudflare CDN cache purge utility
// Silently skips if credentials not configured (dev environment)

export const purgeCache = (): void => {
  const zoneId = process.env.CLOUDFLARE_ZONE_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!zoneId || !apiToken) return

  fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ purge_everything: true }),
  }).catch(err => console.error('Cloudflare cache purge failed:', err))
}
