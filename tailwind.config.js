/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0f87ff',
        'background-light': '#f5f7f8',
        'background-dark': '#0f1923',
        success: '#10B981',
      },
      fontFamily: {
        display: ['Inter', 'Noto Sans Arabic', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
      maxWidth: {
        container: '1200px',
      },
    },
  },
  plugins: [],
};
