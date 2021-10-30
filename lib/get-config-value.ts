import rawSiteConfig from '../site-config.js'

if (!rawSiteConfig) throw new Error(`Config error: invalid site.config.js`)

// TODO: allow environment variables to override site.config.js
let siteConfigOverrides

try {
  if (process.env.NEXT_PUBLIC_SITE_CONFIG) siteConfigOverrides = JSON.parse(process.env.NEXT_PUBLIC_SITE_CONFIG)
} catch (err) {
  console.error('Invalid config "NEXT_PUBLIC_SITE_CONFIG" failed to parse')
  throw err
}
const siteConfig = { ...rawSiteConfig, ...siteConfigOverrides }

export function getSiteConfig<T>(key: string, defaultValue?: T): T {
  const value = siteConfig[key]
  if (value !== undefined) return value
  if (defaultValue !== undefined) return defaultValue
  throw new Error(`Config error: missing required site config value "${key}"`)
}

export function getEnv(key: string, defaultValue?: string | null, env = process.env): string {
  const value = env[key]
  if (value !== undefined) return value
  if (defaultValue === null) return ''
  if (defaultValue !== undefined) return defaultValue
  throw new Error(`Config error: missing required env variable "${key}"`)
}
