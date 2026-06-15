/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fbf7f2',
          100: '#f1e4d6',
          200: '#dfc4aa',
          300: '#cfa178',
          500: '#b3783f',
          600: '#9f5f2c',
          700: '#7f481f',
        },
        slate: {
          200: '#e7e1da',
          300: '#d7cfc7',
          400: '#9c9691',
          500: '#746f6a',
          600: '#5d5752',
          700: '#49433f',
          800: '#3b3735',
          900: '#302f31',
          950: '#27282d',
        },
        zinc: {
          50: '#faf8f5',
          100: '#f0ece7',
          200: '#ded7ce',
          500: '#827a72',
        },
        emerald: {
          600: '#8f704f',
        },
      },
    },
  },
  plugins: [],
};
