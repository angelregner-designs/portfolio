/**
 * Google Analytics 4 event tracking utilities
 *
 * Uses @next/third-parties/google under the hood.
 * Events only fire when NEXT_PUBLIC_GA_ID is configured.
 */

import { sendGAEvent } from '@next/third-parties/google'

// Type-safe event definitions
type AnalyticsEvents = {
  contact_click: { location: 'hero' | 'footer' | 'sticky_nav' }
  project_view: { project_id: string; project_title: string }
  social_click: { platform: string; url: string }
  scroll_depth: { percent: 25 | 50 | 75 | 100 }
  email_click: Record<string, never>
}

type EventName = keyof AnalyticsEvents

/**
 * Track a custom GA4 event
 *
 * @example
 * trackEvent('contact_click', { location: 'hero' })
 * trackEvent('project_view', { project_id: '123', project_title: 'Brand Design' })
 * trackEvent('email_click', {})
 */
export const trackEvent = <T extends EventName>(eventName: T, params: AnalyticsEvents[T]) => {
  // Skip if GA not configured (development)
  if (!process.env.NEXT_PUBLIC_GA_ID) return

  sendGAEvent('event', eventName, params)
}
