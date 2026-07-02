import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFB3D9',
          peach: '#FFCB9A',
          yellow: '#FFFFBA',
          green: '#BAE1BA',
          blue: '#BAC7FF',
          purple: '#E1BAFF',
          lavender: '#D4C5F9',
        },
      },
      fontFamily: {
        cute: ['Noto Sans KR', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};

export default config;
