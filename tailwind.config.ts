import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1c',
          900: '#7f1d1d',
        },
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        aura: {
          '0%': { transform: 'translate3d(0, 0, 0) scale(1)', opacity: '0.5' },
          '100%': { transform: 'translate3d(40px, -30px, 0) scale(1.18)', opacity: '0.8' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-5px)' },
          '40%, 80%': { transform: 'translateX(5px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 7s ease-in-out infinite',
        aura: 'aura 12s ease-in-out infinite alternate',
        shine: 'shine 1.1s ease-in-out',
        shake: 'shake 0.4s ease-in-out',
      },
    },
  },
  plugins: [],
}

export default config
