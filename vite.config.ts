// vite.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, '.'),
    },
  },
  test: {
    includeSource: ['**/*.ts', '**/*.tsx', '**/*.json'],
    environment: 'jsdom',
    coverage: { reporter: ['cobertura', 'html'] },
  },
  build: { target: 'esnext' },
})
