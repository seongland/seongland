module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html',
        'http://localhost/publications/index.html',
        'http://localhost/article/index.html',
      ],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'color-contrast': 'warn',
        'errors-in-console': 'warn',
        'inspector-issues': 'warn',
        'network-dependency-tree-insight': 'warn',
        'unused-javascript': 'warn',
        'valid-source-maps': 'warn',
        'heading-order': 'warn',
        'image-delivery-insight': 'warn',
        'total-byte-weight': 'warn',
        'uses-responsive-images': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
