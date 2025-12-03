/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",  // Angular templates + components
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['"Oswald"', ...defaultTheme.fontFamily.sans],
      }
    },
  },
  plugins: [],
}
