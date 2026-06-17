/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        bg: '#030014',
        bgalt: '#070720',
        accent: '#7042f8',
        accent2: '#00d4ff',
        muted: '#7878a0',
        primary: '#f0f0f8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
