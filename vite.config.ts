// vite.config.ts
import { defineConfig } from 'vitest/config'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'

const ROOT_DIR = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/': resolve(ROOT_DIR, 'src') + '/',
      '~/': resolve(ROOT_DIR) + '/',
    },
  },
  test: {
    includeSource: ['**/*.ts', '**/*.tsx', '**/*.json'],
    environment: 'jsdom',
    coverage: { reporter: ['cobertura', 'html'] },
  },
  build: { target: 'esnext' },
})
