//@ts-check
const withTM = require('next-transpile-modules')(['three'])

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  target: 'serverless',
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ],
  webpack: config => {
    config.externals.push('sharp')
    return config
  },
  experimental: {
    staticPageGenerationTimeout: 2000,
    pageDataCollectionTimeout: 2000,
  },
  reactStrictMode: true,
  rewrites: async () => [{ source: '/social.png', destination: '/api/social-image' }],
}

module.exports = withTM(nextConfig)
