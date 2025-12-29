import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Portfolio Admin'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
      {children}
    </body>
  </html>
)

export default RootLayout
