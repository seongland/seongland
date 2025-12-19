const { bgColor } = require('./site-config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: bgColor,
      },
    },
  },
  plugins: [],
}
