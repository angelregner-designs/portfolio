import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@angel-portfolio/shared'],
}

export default nextConfig
