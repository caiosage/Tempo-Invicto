import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Inter', 'sans-serif']
      },
      colors: {
        abyss: '#060708',
        slate: '#14161a',
        bronze: '#9f8a61',
        gold: '#cfb57f'
      },
      boxShadow: {
        temple: '0 0 0 1px rgba(207, 181, 127, 0.2), 0 24px 48px rgba(0, 0, 0, 0.45)'
      }
    }
  },
  plugins: []
} satisfies Config;
