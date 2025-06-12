const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1' },
        { key: 'Access-Control-Allow-Origin', value: 'https://texonom.com' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
    {
      source: '/_next/static/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      source: '/(image|sound)/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  productionBrowserSourceMaps: true,
  webpack: config => {
    // @ts-ignore
    config.plugins.push(new WindiCSSWebpackPlugin())
    config.externals.push('sharp')
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: process.argv.includes('export'),
    formats: ['image/avif', 'image/webp'],
    domains: ['github.com'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  reactStrictMode: true,
}

const withBundleAnalyzer = require('@next/bundle-analyzer')({ enabled: process.env.ANALYZE === 'true' })
module.exports = withBundleAnalyzer(nextConfig)
