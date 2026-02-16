const { postcss } = require('@tailwindcss/postcss');

module.exports = {
  plugins: [
    postcss([
      require('tailwindcss'),
      require('autoprefixer')
    ])
  ],
}