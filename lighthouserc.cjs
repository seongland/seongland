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
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
