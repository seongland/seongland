import { defineConfig, presetWind, presetAttributify } from 'unocss'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'
import { bgColor } from './site-config'

export default defineConfig({
  dark: 'class',
  include: ['**/*.{tsx,css}'],
  exclude: ['node_modules', '.git', '.next'],
  presets: [presetWind(), presetAttributify()],
  transformers: [transformerAttributifyJsx()],
  theme: {
    colors: {
      background: bgColor,
    },
  },
})
