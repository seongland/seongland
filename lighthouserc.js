const { config } = require('dotenv')

config()
const root = 'http://localhost:8080'

const configuration = {
  ci: {
    collect: {
      url: [root],
      numberOfRuns: 1,
      startServerCommand: 'pnpm start',
      upload: process.env.LHCI_TOKEN
        ? {
            target: 'lhci',
            serverBaseUrl: 'https://lhci.fly.dev',
          }
        : {
            target: 'temporary-public-storage',
          },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        bypass: 'warn',
        canonical: 'warn',
        deprecations: 'warn',
        'aria-command-name': 'warn',
        'bf-cache': 'warn',
        'csp-xss': 'warn',
        'link-name': 'warn',
        'offscreen-images': 'warn',
        'document-title': 'warn',
        'non-composited-animations': 'warn',
        'image-alt': 'warn',
        'errors-in-console': 'warn',
        'maskable-icon': 'warn',
        'color-contrast': 'warn',
        'valid-source-maps': 'warn',
        'uses-optimized-images': 'warn',
        'crawlable-anchors': 'warn',
        'unsized-images': 'warn',
        'inspector-issues': 'warn',
        'uses-rel-preconnect': 'warn',
        'tap-targets': 'warn',
        'image-aspect-ratio': 'warn',
        'lcp-lazy-loaded': 'warn',
        'service-worker': 'warn',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'heading-order': 'warn',
        'themed-omnibox': 'warn',
        'meta-description': 'warn',
        'total-byte-weight': 'warn',
        'uses-responsive-images': 'warn',
        'robots-txt': 'warn',
        'efficient-animated-content': 'warn',
        'duplicated-javascript-insight': 'warn',
        'forced-reflow-insight': 'warn',
        'image-delivery-insight': 'warn',
        'legacy-javascript-insight': 'warn',
      },
    },
  },
}

module.exports = configuration
