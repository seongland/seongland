// vite.config.ts
import { defineConfig } from 'vitest/config'
import { resolve, sep } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: resolve(__dirname, './src'),
        customResolver: (to, from) => {
          if (from) {
            const froms = from.split(sep)
            const rootIndex = froms.findIndex(folder => folder === 'src')
            const tos = to.split(sep)
            tos.splice(rootIndex, 0, froms[rootIndex])
            return tos.join(sep)
          }
        },
      },
      {
        find: '~',
        replacement: resolve(__dirname, '.'),
        customResolver: (to, from) => {
          if (from) {
            const froms = from.split(sep)
            const rootIndex = froms.findIndex(folder => folder === 'src')
            const tos = to.split(sep)
            tos.splice(rootIndex, 0, froms[rootIndex])
            return tos.join(sep)
          }
        },
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
