export const darkThemeClasses = {
  // Base Layout
  body: 'bg-[#0a0a0a] text-gray-100',
  container: 'bg-[#0a0a0a] text-gray-100',

  // Backgrounds
  background: {
    primary: 'bg-[#0a0a0a]',
    secondary: 'bg-[#1a1a1a]',
    card: 'bg-[#1e1e1e]',
  },

  // Text Colors
  text: {
    primary: 'text-gray-100',
    secondary: 'text-gray-400',
    muted: 'text-gray-500',
  },

  // Border Colors
  border: {
    default: 'border-gray-700',
    accent: 'border-[#00aaff]',
  },

  // Button Styles
  button: {
    primary: 'bg-[#00aaff] text-white hover:bg-[#0088cc]',
    secondary: 'bg-[#1e1e1e] text-[#00aaff] border border-[#00aaff] hover:bg-[#2a2a2a]',
  },

  // Form Inputs
  input: {
    base: 'bg-[#1e1e1e] text-gray-100 border-gray-700 focus:ring-[#00aaff]',
  },

  // Animations
  animations: {
    hover: 'transition duration-300 ease-in-out hover:scale-[1.02]',
  },
};

export function applyDarkTheme(baseClasses: string = '') {
  return `${darkThemeClasses.body} ${baseClasses}`;
}