/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        blood: {
          50:  '#fff1f1',
          100: '#ffd9d9',
          500: '#e53935',
          600: '#c62828',
          700: '#b71c1c',
        },
      },
    },
  },
  plugins: [],
}
