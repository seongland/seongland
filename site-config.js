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
  notionUserId: pkg.author.notion.rootId,
  rootNotionPageId: pkg.author.notion.rootId,
  rootNotionSpaceId: pkg.author.notion.spaceId,
  isPreviewImageSupportEnabled: true,
  socialImageTitle: pkg.displayName,
  socialImageSubtitle: pkg.description,
  defaultPageCoverPosition: 0.5,
  includeNotionIdInUrls: true,
  utterancesGitHubRepo: pkg.path,

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
  pageUrlOverrides: {
    '/wiki': pkg.author.notion.rootId,
    '/logic': 'e562053ace984677a72cb9eaf5c6f91e',
    '/portfolio': 'b418523753984d4e8c940ede2e3de680',
    '/resume': '30022b4afb6f4d6e8446e0d49ec0a92f',
    '/computing': '3c7dae6f75754b0eaacefe11b809ee35',
    '/mathematics': '2731da9546944e7bb9455cedddd0f87f',
    '/meta-science': 'bd533ed4e91c47809d96a342b5ddcccf',
    '/applied-science': 'b6487154864c4aa9bcc0cdf09f6beaa6',
    '/computer-application': '07680c91b1464e2aba83c5d44752fc2c',
    '/computer-engineering': '46fa1b6d1f7e4297b85d8ff0b27fc803',
    '/society': '6d649d5e3a1b45ecbfba6ad536e6c987',
    '/visual-design': '9338a889bc2845948faae416a0772bf0',
    '/sound-design': 'da010ab49f0b459eaa670d33b730277e',
    '/notion-cloudflare': 'aeb0f8e85c3e49c18b4c3320254305a7',
    '/testament': '39788903601a40fab6b2ff3f4bc42518',
    '/present': 'b612831ac69d4787b502237bdb87b66a',
  },

  // Color
  bgColor: pkg.color,
  themeColor: pkg.color,
}
