/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './pages/**/*.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        bg: '#030014',
        bgalt: '#070720',
        'bg-card': '#0a0a2e',
        accent: '#7042f8',
        'accent-light': '#a78bfa',
        accent2: '#00d4ff',
        'accent2-light': '#67e8f9',
        muted: '#7878a0',
        primary: '#f0f0f8',
        surface: '#0d0d2b',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      maxWidth: {
        site: '1400px',
        wide: '1600px',
      },
      screens: {
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
};
