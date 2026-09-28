// Configuration Tailwind (sert uniquement à générer css/app.css ; voir README).
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './js/**/*.js'],
  safelist: ['grid-cols-2', 'grid-cols-3', 'grid-cols-4'],
  theme: {
    extend: {
      colors: {
        dutchOrange: { DEFAULT: '#D93F00', hover: '#B33600', light: '#FFF0EB', dark: '#B33600' },
        delftBlue: { DEFAULT: '#0A2540', hover: '#071B30', light: '#1E3A8A', soft: '#EBF2FA' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
};
