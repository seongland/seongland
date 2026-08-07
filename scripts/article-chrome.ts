// Renders the seongland header and footer as plain HTML for injection into
// prebuilt article pages. Styling lives in public/article-chrome.css.

import { footerLinks, isActiveTab, navTabs, siteName } from '../src/data/nav.ts'

const SUN = `<svg class="sl-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/><line x1="4.22" y1="4.22" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.78" y2="19.78"/><line x1="4.22" y1="19.78" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.78" y2="4.22"/></svg>`

const MOON = `<svg class="sl-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`

const BURGER = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function themeButton(): string {
  return `<button type="button" class="sl-icon-btn sl-theme" aria-label="Toggle color theme">${SUN}${MOON}</button>`
}

function tabs(pathname: string, className: string): string {
  return navTabs
    .map(tab => {
      const current = isActiveTab(tab.href, pathname) ? ' aria-current="page"' : ''
      return `<a class="${className}" href="${escapeHtml(tab.href)}"${current}>${escapeHtml(tab.label)}</a>`
    })
    .join('')
}

/** `pathname` decides which tab is marked current; articles pass an /article path. */
export function renderHeader(pathname = '/article'): string {
  return [
    '<header class="sl-chrome" data-sl-chrome>',
    '<nav class="sl-nav" aria-label="Seongland">',
    `<a class="sl-brand" href="/">${escapeHtml(siteName)}</a>`,
    `<div class="sl-tabs">${tabs(pathname, 'sl-tab')}${themeButton()}</div>`,
    '<div class="sl-mobile">',
    themeButton(),
    `<button type="button" class="sl-icon-btn" id="sl-menu-btn" aria-label="Toggle menu" aria-controls="sl-menu" aria-expanded="false">${BURGER}</button>`,
    '</div>',
    '</nav>',
    `<div class="sl-menu" id="sl-menu" data-open="0">${tabs(pathname, 'sl-tab')}</div>`,
    '</header>',
  ].join('')
}

export function renderFooter(year: number): string {
  const links = footerLinks
    .map(
      link => `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`,
    )
    .join('')
  return [
    '<footer class="sl-footer" data-sl-chrome-footer>',
    '<div class="sl-footer-inner">',
    `<span>&copy; ${year} Seonglae Cho</span>`,
    `<div class="sl-footer-links">${links}</div>`,
    '</div>',
    '</footer>',
  ].join('')
}
