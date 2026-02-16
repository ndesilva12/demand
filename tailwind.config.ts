import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          background: '#0a0a0a',
          surface: '#1a1a1a',
          text: {
            primary: '#e0e0e0',
            muted: '#a0a0a0',
          },
        },
        primary: {
          DEFAULT: '#00aaff',
          dark: '#0088cc',
        },
      },
      backgroundColor: {
        dark: {
          DEFAULT: '#0a0a0a',
          surface: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}