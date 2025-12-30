import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Portfolio Admin',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className='m-0 font-sans bg-gray-50 text-gray-900 min-h-screen'>{children}</body>
  </html>
)

export default RootLayout
