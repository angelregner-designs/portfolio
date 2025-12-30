import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Angel Regner | Product, Brand, and Digital Designer',
  description: 'I design with intention, balancing creative expression with clarity and purpose.',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang='en'>
    <head>
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
      <link
        href='https://fonts.googleapis.com/css2?family=Averia+Serif+Libre:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap'
        rel='stylesheet'
      />
    </head>
    <body className="font-['Averia_Serif_Libre',serif]">{children}</body>
  </html>
)

export default RootLayout
