/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#050816',
        cyber: '#00E5FF',
        plasma: '#B64BFF',
        aurora: '#40F99B',
      },
      boxShadow: {
        glow: '0 0 34px rgba(0, 229, 255, 0.32)',
        violet: '0 0 42px rgba(182, 75, 255, 0.28)',
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3.4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-16px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', filter: 'blur(0)' },
          '50%': { opacity: '1', filter: 'blur(1px)' },
        },
      },
    },
  },
  plugins: [],
};
