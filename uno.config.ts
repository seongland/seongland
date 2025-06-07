import { defineConfig, presetWind, presetAttributify } from 'unocss'
import { bgColor } from './site-config'

export default defineConfig({
  dark: 'class',
  include: ['**/*.{tsx,css}'],
  exclude: ['node_modules', '.git', '.next'],
  presets: [presetWind(), presetAttributify()],
  theme: {
    colors: {
      background: bgColor,
    },
  },
})
