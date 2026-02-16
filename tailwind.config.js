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
        dark: {
          background: '#0a0a0a',
          surface: '#1a1a1a',
          text: '#e0e0e0',
        },
      },
      backgroundColor: {
        'dark-bg': '#0a0a0a',
        'dark-surface': '#1a1a1a',
      },
      textColor: {
        'dark-text': '#e0e0e0',
      },
    },
  },
  plugins: [],
}