const pkg = require('./package.json')

module.exports = {
  title: pkg.displayName,
  name: pkg.displayName,
  description: pkg.description,

  // Personal Info
  url: `https://${pkg.domain}`,
  domain: pkg.domain,
  previous: pkg.author.url,
  author: pkg.author.name,
  email: pkg.author.email,

  // Social
  twitterUsername: pkg.author.twitter.name,
  twitter: pkg.author.twitter.name,
  github: pkg.author.github.name,
  linkedin: pkg.author.linkedin.name,
  socials: {
    GitHub: pkg.repository,
    Twitter: pkg.author.twitter.url,
    LinkedIn: pkg.author.linkedin.url,
  },

  // Color
  bgColor: pkg.color,
}
