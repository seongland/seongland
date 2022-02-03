const pkg = require('./package.json')

const descriptionMd = pkg.description
const description = descriptionMd
  .replace(/\[([^\]]+)\](\([^)]+\)|\[[^\]]+\])/g, '$1')
  .replace(/\n/g, '')
  .replace(/\s{2,}/g, ' ')
  .trim()

module.exports = {
  title: pkg.displayName,
  name: pkg.displayName,
  descriptionMd,
  description,

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
    Twitter: pkg.author.twitter.name,
  },

  // Color
  bgColor: pkg.color,
  themeColor: pkg.color,
}
