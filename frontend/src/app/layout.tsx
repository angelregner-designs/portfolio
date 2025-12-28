import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'Angel Regner | Product, Brand, and Digital Designer',
  description: 'I design with intention, balancing creative expression with clarity and purpose.',
}

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Lato:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body className="font-lato antialiased">{children}</body>
  </html>
)

export default RootLayout
