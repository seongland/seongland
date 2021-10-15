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
        {
          key: 'Content-Security-Policy',
          value: `default-src https:;
                  script-src 'self' *.cloudflare.com www.googletagmanager.com www.google-analytics.com static.cloudflareinsights.com 'unsafe-inline'`,
        },
      ],
    },
  ],
  webpack: config => {
    config.externals.push('sharp')
    return config
  },
  pageDataCollectionTimeout: 1,
  reactStrictMode: true,
  rewrites: async () => [{ source: '/social.png', destination: '/api/social-image' }],
}

module.exports = withTM(nextConfig)
