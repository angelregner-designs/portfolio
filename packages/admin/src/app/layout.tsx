import { cn } from '@angel-portfolio/shared'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Portfolio Admin',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className={cn('m-0', 'min-h-screen', 'font-sans', 'text-gray-900 bg-gray-50')}>
      {children}
      <Toaster position='top-right' richColors />
    </body>
  </html>
)

export default RootLayout
