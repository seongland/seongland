/**
 * Behaviour for the seongland chrome injected into prebuilt article pages:
 * mobile menu, theme toggle, and the BibTeX copy button the article template
 * does not ship. Telemetry picks the copy up through its data-sl-event hook.
 */

function wireMobileMenu() {
  const button = document.getElementById('sl-menu-btn')
  const menu = document.getElementById('sl-menu')
  if (!button || !menu) return
  const setOpen = open => {
    menu.dataset.open = open ? '1' : '0'
    button.setAttribute('aria-expanded', String(open))
  }
  button.addEventListener('click', () => setOpen(menu.dataset.open !== '1'))
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)))
}

function wireThemeToggle() {
  const root = document.documentElement
  document.querySelectorAll('.sl-theme').forEach(button => {
    button.addEventListener('click', () => {
      // Prefer the article's own (hidden) control so any template-side effects run.
      const native = document.getElementById('theme-toggle')
      if (native) {
        native.click()
        return
      }
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark'
      root.dataset.theme = next
      try {
        localStorage.setItem('theme', next)
      } catch {
        /* private mode: the toggle still works for this page */
      }
    })
  })
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand?.('copy') ?? false
    area.remove()
    return ok
  }
}

function addBibtexCopy() {
  const block = document.querySelector('.citation-block pre.citation.long')
  if (!block || block.previousElementSibling?.classList.contains('sl-copy-btn')) return

  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'sl-copy-btn'
  button.textContent = 'Copy BibTeX'
  button.setAttribute('aria-label', 'Copy BibTeX citation')
  button.setAttribute('data-sl-event', 'bibtex_copy')
  button.setAttribute('data-sl-label', 'bibtex')

  button.addEventListener('click', async () => {
    const copied = await copyText(block.textContent ?? '')
    button.textContent = copied ? 'Copied' : 'Copy failed'
    button.dataset.copied = copied ? '1' : '0'
    setTimeout(() => {
      button.textContent = 'Copy BibTeX'
      delete button.dataset.copied
    }, 1600)
  })

  block.parentNode.insertBefore(button, block)
}

function boot() {
  wireMobileMenu()
  wireThemeToggle()
  addBibtexCopy()
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()
