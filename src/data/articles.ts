// The article Spaces built by scripts/build-articles.sh and copied into
// public/article/<id>/. Adding one here wires up the sitemap and the telemetry
// allowlist at the same time; the submodule itself still has to be added.

export const spaceArticleIds = [
  'optimismbench',
  'asg',
  'paat',
  'agentroom',
  'crl',
  'corrsteer',
  'confidence-manifold',
] as const

/** The ASG dashboard ships as a nested app under the asg article. */
export const trackedArticleIds: string[] = [...spaceArticleIds, 'asg/browser']

/**
 * Site pages measured alongside the articles, so a visit that starts on the
 * home page and ends in an article is one readable path. Kept in step with
 * SITE_PAGES in public/telemetry-core.js.
 */
export const sitePageIds = ['home', 'publications', 'projects', 'articles'] as const

export const trackedPageIds: string[] = [...trackedArticleIds, ...sitePageIds]
