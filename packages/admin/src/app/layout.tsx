import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Portfolio Admin',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <body className='m-0 font-sans bg-gray-50 text-gray-900 min-h-screen'>
      {children}
      <Toaster position='top-right' richColors />
    </body>
  </html>
)

export default RootLayout
