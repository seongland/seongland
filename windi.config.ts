import { defineConfig } from 'windicss/helpers'
import { bgColor } from './site-config'

export default defineConfig({
  darkMode: 'class',
  attributify: true,
  extract: {
    include: ['**/*.{tsx,css}'],
    exclude: ['node_modules', '.git', '.next'],
  },
  theme: {
    extend: {
      colors: {
        background: bgColor,
      },
    },
  },
})
