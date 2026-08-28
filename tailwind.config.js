/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#0b0d1e',
        },
        obsidian: {
          base: '#060713',
          surface: '#0d1024',
          card: '#121733',
          border: 'rgba(255, 255, 255, 0.08)',
          highlight: 'rgba(255, 255, 255, 0.18)'
        },
        cyber: {
          neon: '#00f0ff',
          pink: '#ff007f',
          purple: '#8b00ff',
          amber: '#ffaa00',
          emerald: '#00ffaa',
          dark: '#070814',
          card: '#0f132a',
        }
      },
      boxShadow: {
        '3d-sm': '0 4px 12px -2px rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)',
        '3d': '0 12px 30px -8px rgba(0, 0, 0, 0.75), inset 0 1px 1px 0 rgba(255, 255, 255, 0.14)',
        '3d-lg': '0 20px 45px -10px rgba(0, 0, 0, 0.85), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18), 0 0 25px -5px rgba(99, 102, 241, 0.2)',
        '3d-hover': '0 24px 50px -10px rgba(0, 0, 0, 0.9), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25), 0 0 35px -5px rgba(99, 102, 241, 0.35)',
        '3d-btn': '0 4px 0 0 #3730a3, 0 10px 22px -4px rgba(99, 102, 241, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
        '3d-btn-pink': '0 4px 0 0 #9d174d, 0 10px 22px -4px rgba(236, 72, 153, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
        '3d-btn-emerald': '0 4px 0 0 #065f46, 0 10px 22px -4px rgba(16, 185, 129, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
        '3d-btn-amber': '0 4px 0 0 #92400e, 0 10px 22px -4px rgba(245, 158, 11, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
        'glow-indigo': '0 0 25px -3px rgba(99, 102, 241, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
        'glow-cyan': '0 0 25px -3px rgba(6, 182, 212, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
        'glow-pink': '0 0 25px -3px rgba(236, 72, 153, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
        'glow-emerald': '0 0 25px -3px rgba(16, 185, 129, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
        'glow-amber': '0 0 25px -3px rgba(245, 158, 11, 0.55), inset 0 1px 1px 0 rgba(255, 255, 255, 0.25)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
