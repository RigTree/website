/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'grid-fade': 'grid-fade 4s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          from: { opacity: 0.4 },
          to: { opacity: 1 },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'grid-fade': {
          '0%, 100%': { opacity: 0.03 },
          '50%': { opacity: 0.08 },
        },
      },
    },
  },
  plugins: [],
};
