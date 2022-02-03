//@ts-check
const withTM = require('next-transpile-modules')(['three'])
const WindiCSS = require('windicss-webpack-plugin').default

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
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ],
  webpack: config => {
    config.plugins.push(new WindiCSS())
    config.externals.push('sharp')
    return config
  },
  pageDataCollectionTimeout: 2000,
  reactStrictMode: true,
  rewrites: async () => [{ source: '/social.png', destination: '/api/social-image' }],
}

module.exports = withTM(nextConfig)
