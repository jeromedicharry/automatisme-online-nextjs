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
        'primary-dark': '#021835',
        'primary-ter': '#3099D1',
        'secondary-light': '#FFECDB',
        'secondary-dark': '#BA3E16',
        'dark-grey': '#6F6F6F',
        'placeholder-grey': '#B8B8B8',
        greyhover: '#F2F2F2',
      },
      boxShadow: {
        card: '0px 0px 10px -3px rgba(0, 0, 0, 0.25)',
        cardhover: '0px 0px 10px -3px rgba(0, 0, 0, 0.45)',
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
        'card-featured-mobile': '350 / 204',
        'card-featured-laptop': '380 / 579',
        'card-faq': '345 / 144',
        'promo-slide-main-mobile': '350 / 228',
        'promo-slide-main-laptop': '736 / 330',
        'promo-slide-secondary-mobile': '282 / 98',
        'promo-slide-secondary-laptop': '315 / 161',
        'promo-slide-secondary-unique': '315 / 330',
      },
      fontSize: {
        '5xl': ['3rem', { lineHeight: '1.2' }],
      },
      lineHeight: {
        general: '1.2',
      },
    },
  },
  plugins: [],
};
