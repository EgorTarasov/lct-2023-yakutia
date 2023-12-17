/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        btn: '0px 1px 0px 2px rgba(11, 10, 10, 0.10)',
      },

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

      fontFamily: {
        gotham: ['Gotham Pro', 'sans-serif'],
      },

      fontSize: {
        '8xl': ['80px', '96px'],
        h1: ['64px', '72px'],
        'mobile-h1': ['30px', '36px'],
        headline: ['48px', '60px'],
        h2: ['40px', '48px'],
        'mobile-h2': ['20px', '28px'],
        subh: ['32px', '40px'],
        h3: ['24px', '36px'],
        body: ['18px', '26px'],
        based: ['16px', '24px'],
        caption: ['14px', '20px'],
        placeholder: ['10px', '16px'],
      },
      borderRadius: {
        input: '30px',
      },

      maxWidth: {
        'screen-2xl': '1280px',
      },
    },
  },
  plugins: [],
};
