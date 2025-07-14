/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff006e',
          blue: '#3a86ff',
          purple: '#8338ec',
          green: '#06ffa5',
          yellow: '#ffbe0b',
        }
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glitch': 'glitch 2s infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
        'float': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-10px)',
          },
        },
        'glitch': {
          '0%': {
            transform: 'translate(0)',
          },
          '20%': {
            transform: 'translate(-2px, 2px)',
          },
          '40%': {
            transform: 'translate(-2px, -2px)',
          },
          '60%': {
            transform: 'translate(2px, 2px)',
          },
          '80%': {
            transform: 'translate(2px, -2px)',
          },
          '100%': {
            transform: 'translate(0)',
          },
        },
      },
    },
  },
  plugins: [],
}