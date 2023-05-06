// vite.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
        customResolver: to => to,
      },
      {
        find: '~',
        replacement: resolve(__dirname, '.'),
        customResolver: to => to,
      },
    ],
  },
  test: {
    includeSource: ['**/*.ts', '**/*.tsx', '**/*.json'],
    environment: 'jsdom',
    coverage: { reporter: ['cobertura', 'html'] },
  },
  build: { target: 'esnext' },
})
