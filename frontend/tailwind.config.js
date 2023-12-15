/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#F5F5F5',
          500: '#A19696',
          900: '#0B0A0A',
        },
        secondary: {
          100: '#E2E2D5',
          200: '#888883',
        },

        'main-black': '#0B0A0A',
      },

      fontSize: {
        h1: '60px',
        label: '10px',
      },
      borderRadius: {
        input: '30px',
      },

      maxWidth: {
        'screen-2xl': '1440px',
      },
    },
  },
  plugins: [],
};
