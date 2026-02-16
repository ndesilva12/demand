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
        // Dark theme colors
        dark: {
          background: '#0a0a0a',
          surface: '#1a1a1a',
          border: '#2a2a2a',
        },
        primary: {
          DEFAULT: '#00aaff',
          dark: '#0088cc',
        },
        gray: {
          900: '#0a0a0a',  // Background
          800: '#1a1a1a',  // Surface
          700: '#2a2a2a',  // Border
          600: '#3a3a3a',  // Muted
          100: '#e0e0e0',  // Lightest text
          400: '#a0a0a0',  // Muted text
        },
      },
      backgroundColor: {
        // Explicit mappings to ensure compatibility
        'gray-900': '#0a0a0a',
        'gray-800': '#1a1a1a',
        'gray-100': '#1e1e1e',
        'white': '#1a1a1a',
      },
      textColor: {
        // Explicit text color mappings
        'gray-900': '#e0e0e0',
        'gray-800': '#d0d0d0',
        'gray-700': '#b0b0b0',
        'gray-600': '#a0a0a0',
      },
      borderColor: {
        // Border color mappings
        'gray-300': '#3a3a3a',
        'gray-700': '#2a2a2a',
      },
    },
  },
  plugins: [],
}
export default config