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
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
        'stage-in': {
          '0%': { opacity: '0', transform: 'perspective(900px) rotateX(8deg) translateY(28px)' },
          '100%': { opacity: '1', transform: 'perspective(900px) rotateX(0) translateY(0)' },
        },
        'draw-line': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
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
        marquee: 'marquee 32s linear infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        'pulse-glow': 'pulse-glow 5s ease-in-out infinite',
        'stage-in': 'stage-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'draw-line': 'draw-line 1.2s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}

export default config
