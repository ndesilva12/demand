import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      // Explicitly define all colors to ensure compatibility
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#e0e0e0', // Dark theme "white"
      
      // Dark theme color palette
      gray: {
        900: '#0a0a0a',    // Darkest background
        800: '#1a1a1a',    // Dark surface
        700: '#2a2a2a',    // Border
        600: '#3a3a3a',    // Muted background
        500: '#4a4a4a',    // Muted text
        400: '#a0a0a0',    // Light muted text
        300: '#b0b0b0',    // Lighter muted text
        200: '#c0c0c0',    // Very light text
        100: '#e0e0e0',    // Lightest text (replaces white)
      },
      
      // Primary color
      primary: {
        DEFAULT: '#00aaff',
        dark: '#0088cc',
        light: '#33bbff',
      },
      
      // Semantic colors
      blue: {
        DEFAULT: '#00aaff',
        dark: '#0088cc',
      },
      
      // Status colors
      green: {
        DEFAULT: '#2ecc71',
        dark: '#27ae60',
      },
      red: {
        DEFAULT: '#e74c3c',
        dark: '#c0392b',
      },
    },
    extend: {
      backgroundColor: {
        // Explicit mappings to ensure compatibility
        'white': '#1a1a1a',
        'gray-50': '#0a0a0a',
        'gray-100': '#1e1e1e',
        'gray-900': '#0a0a0a',
      },
      textColor: {
        // Explicit text color mappings
        'white': '#e0e0e0',
        'gray-900': '#e0e0e0',
        'gray-800': '#d0d0d0',
        'gray-700': '#b0b0b0',
        'gray-600': '#a0a0a0',
      },
      borderColor: {
        // Border color mappings
        'white': '#2a2a2a',
        'gray-300': '#3a3a3a',
        'gray-700': '#2a2a2a',
      },
    },
  },
  plugins: [],
}