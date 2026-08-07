// Stands in for the virtual `astro:env/server` module under vitest. Reading
// process.env at call time keeps vi.stubEnv working in the endpoint tests.
export function getSecret(name: string): string | undefined {
  return process.env[name]
}
