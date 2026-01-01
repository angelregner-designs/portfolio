import type { Metadata } from 'next'
import { Averia_Serif_Libre } from 'next/font/google'
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

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className={`${averiaSerifLibre.className} overflow-x-hidden`}>{children}</body>
  </html>
)

export default RootLayout
