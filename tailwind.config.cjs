/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        insta: {
          pink: '#FD1D1D',
          purple: '#833AB4',
          yellow: '#FCAF45'
        }
      },
      backgroundImage: {
        'insta-gradient': 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)'
      }
    }
  },
  plugins: []
};
