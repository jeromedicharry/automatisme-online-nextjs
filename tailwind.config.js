/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.tsx', './src/pages/**/*.tsx'],
  theme: {
    extend: {
      colors: {
        'medium-blue': '#3099D1',
        primary: '#042B60',
        secondary: '#E94E1B',
        'primary-light': '#F7F8FD',
        'primary-light-alt': '#E9F6FF',
        'secondary-light': '#FFECDB',
      },
      fontFamily: {
        primary: ['Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 0px 10px -3px rgba(0, 0, 0, 0.25)',
      },
      container: {
        screens: {
          xs: '380px',
          sm: '640px',
          md: '940px',
          lg: '1140px',
          xl: '1300px',
          xxl: '1580px',
        },
      },
      aspectRatio: {
        'card-post': '184 / 144',
        'card-post-mobile': '345 / 144',
        'card-post-featured': '519 / 320',
        'card-post-related': '393 / 144',
      },
    },
  },
  plugins: [],
};
