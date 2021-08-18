//@ts-check
const withTM = require('next-transpile-modules')(['three'])

/** @type{import('next').NextConfig}*/
const nextConfig = {
  target: 'serverless',
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Access-Control-Allow-Credentials',
          value: 'true',
        },
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
        {
          key: 'Access-Control-Allow-Methods',
          value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
        },
        {
          key: 'Access-Control-Allow-Headers',
          value: `X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version`,
        },
      ],
    },
  ],
  webpack: config => {
    config.externals.push('sharp')
    return config
  },
  experimental: {
    pageDataCollectionTimeout: 200,
  },
  reactStrictMode: true,
  rewrites: async () => [{ source: '/social.png', destination: '/api/social-image' }],
}

module.exports = withTM(nextConfig)
