/**
 * Categorical hues for the flow views, in fixed assignment order.
 *
 * Checked with the dataviz validator against both the light (#f5f0e8) and dark
 * (#111418) surfaces: lightness band, chroma floor, colour-vision separation
 * and the normal-vision floor all pass. A fifth hue could not be added without
 * failing CVD separation against the blue, so anything past the fourth page
 * folds into neutral rather than inventing a hue. Both surfaces flag sub-3:1
 * contrast, which is relieved here because every node carries a direct label.
 */
export const FLOW_HUES = ['#2a9d8f', '#c44536', '#c49a3a', '#4a72b0'] as const

/** Pages beyond the fourth are not given an identity colour. */
export const FLOW_NEUTRAL = 'var(--color-ink-4)'

/**
 * Fixed page → hue map. Colour follows the page, never its rank in the current
 * filter, so narrowing the window cannot repaint the pages that survive.
 */
export function assignHues(pagesByVolume: string[]): Map<string, string> {
  const out = new Map<string, string>()
  pagesByVolume.forEach((page, index) => {
    out.set(page, index < FLOW_HUES.length ? FLOW_HUES[index] : FLOW_NEUTRAL)
  })
  return out
}

/** Site pages read better with a name than with their raw id. */
const LABELS: Record<string, string> = {
  home: 'Home',
  publications: 'Publications',
  projects: 'Projects',
  articles: 'Articles index',
}

export function pageLabel(page: string): string {
  return LABELS[page] ?? page
}
