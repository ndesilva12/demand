import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Systematic dark theme color palette
      colors: {
        // Core brand color
        primary: {
          DEFAULT: '#00aaff',   // Bright blue
          dark: '#0088cc',      // Deeper blue
          light: '#33bbff',     // Lighter blue
        },
        
        // Comprehensive grayscale for dark mode
        dark: {
          background: {
            deep: '#0a0a0a',    // Deepest background
            DEFAULT: '#1a1a1a', // Primary dark surface
            light: '#2a2a2a',   // Lighter dark surface
          },
          text: {
            primary: '#e0e0e0', // Primary text
            secondary: '#a0a0a0', // Secondary text
            muted: '#6a6a6a',   // Muted text
          },
          border: {
            DEFAULT: '#3a3a3a', // Default border
            light: '#4a4a4a',   // Lighter border
          },
        },
      },
      
      // Enhanced typography
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      
      // Advanced spacing and sizing
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },
      
      // Sophisticated shadows for depth
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 170, 255, 0.05)',
        'dark-md': '0 4px 6px -1px rgba(0, 170, 255, 0.1), 0 2px 4px -1px rgba(0, 170, 255, 0.06)',
        'dark-lg': '0 10px 15px -3px rgba(0, 170, 255, 0.1), 0 4px 6px -2px rgba(0, 170, 255, 0.05)',
      },
      
      // Transition and animation defaults
      transitionProperty: {
        'default': 'background-color, border-color, color, fill, stroke, opacity, box-shadow, transform',
      },
      transitionTimingFunction: {
        'default': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'default': '300ms',
      },
      
      // Responsive breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  
  // Advanced plugins for enhanced functionality
  plugins: [
    // Custom plugin for dark mode utility classes
    function({ addUtilities }) {
      const darkUtilities = {
        '.bg-dark': {
          backgroundColor: '#1a1a1a',
        },
        '.text-dark': {
          color: '#e0e0e0',
        },
        '.border-dark': {
          borderColor: '#3a3a3a',
        },
        '.btn-primary': {
          backgroundColor: '#00aaff',
          color: 'white',
          '&:hover': {
            backgroundColor: '#0088cc',
          },
        },
      }
      addUtilities(darkUtilities)
    }
  ],
  
  // Ensure dark mode is always active
  darkMode: 'class',
}

export default config