import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from 'next'
import { Averia_Serif_Libre } from 'next/font/google'
import { VersionLogger } from '../components/VersionLogger'
import './globals.css'

const averiaSerifLibre = Averia_Serif_Libre({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  display: 'block',
})

export const metadata: Metadata = {
  title: 'Angel Regner | Product, Brand, and Digital Designer',
  description: 'I design with intention, balancing creative expression with clarity and purpose.',
}

// GA4 - only loads when configured, disabled in dev
const GA_ID = process.env.NEXT_PUBLIC_GA_ID

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className={`${averiaSerifLibre.className} overflow-x-hidden`}>{children}</body>
    <VersionLogger />
    {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
  </html>
)

export default RootLayout
