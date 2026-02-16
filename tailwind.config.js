/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00aaff',
        gray: {
          900: '#0a0a0a',    // Dark background
          800: '#1a1a1a',    // Dark surface
          700: '#2a2a2a',    // Dark border
          600: '#3a3a3a',    // Dark muted
          500: '#4a4a4a',    // Dark text muted
          400: '#a0a0a0',    // Light muted text
          300: '#b0b0b0',    // Lighter muted text
          200: '#c0c0c0',    // Very light text
          100: '#e0e0e0',    // Lightest text
        },
      },
      backgroundColor: {
        'gray-900': '#0a0a0a',   // Dark background
        'gray-800': '#1a1a1a',   // Dark surface
        'gray-100': '#1e1e1e',   // Dark light surface
        'white': '#1a1a1a',      // Dark white equivalent
      },
      textColor: {
        'gray-900': '#e0e0e0',   // Dark text primary
        'gray-800': '#d0d0d0',   // Dark text secondary
        'gray-700': '#b0b0b0',   // Dark text muted
        'gray-600': '#a0a0a0',   // Dark text very muted
        'white': '#e0e0e0',      // Dark white text
      },
      borderColor: {
        'gray-900': '#2a2a2a',   // Dark border
        'gray-800': '#3a3a3a',   // Dark border secondary
        'gray-300': '#4a4a4a',   // Dark border light
        'white': '#2a2a2a',      // Dark white border
      },
    },
  },
  plugins: [],
}