/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
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
    },
  },
  plugins: [],
}