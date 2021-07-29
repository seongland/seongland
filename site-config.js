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

  // Notion X Option
  rootNotionPageId: pkg.author.notion.rootId,
  rootNotionSpaceId: pkg.author.notion.spaceId,
  isPreviewImageSupportEnabled: true,
  socialImageTitle: pkg.displayName,
  socialImageSubtitle: pkg.description,
  defaultPageCoverPosition: 0.5,
  includeNotionIdInUrls: true,
  utterancesGitHubRepo: pkg.repo,

  // Personal Info
  url: `https://${pkg.domain}`,
  domain: pkg.domain,
  previous: pkg.author.url,
  author: pkg.author.name,
  email: pkg.author.email,

  // Social
  twitterUsername: pkg.author.twitter.name,
  twitter: pkg.author.twitter.url,
  github: pkg.author.github.name,
  linkedin: pkg.author.linkedin.name,
  socials: {
    GitHub: pkg.repository,
    Twitter: pkg.author.twitter.url,
  },

  // Color
  bgColor: '#2f3437',
  themeColor: '#46c0aE',
}
