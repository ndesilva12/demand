/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00aaff',
          dark: '#0088cc',
        },
        dark: {
          background: '#0a0a0a',
          surface: '#1a1a1a',
          text: {
            DEFAULT: '#e0e0e0',
            muted: '#a0a0a0',
          },
        },
      },
    },
  },
  plugins: [
    plugin(function({ addBase, theme }) {
      addBase({
        'body': { 
          backgroundColor: theme('colors.dark.background'),
          color: theme('colors.dark.text.DEFAULT'),
        },
      })
    })
  ],
}