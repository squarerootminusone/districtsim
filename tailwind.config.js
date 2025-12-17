/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Civ6-inspired dark theme
        'civ': {
          'bg': '#0a1929',
          'surface': '#0f1b2a',
          'panel': '#162332',
          'border': '#3f5573',
          'hover': '#1e3a5f',
          'accent': '#c9a227',
          'gold': '#ffd700',
        },
        'yield': {
          'food': '#7cb342',
          'production': '#ff8f00',
          'gold': '#ffd54f',
          'science': '#29b6f6',
          'culture': '#ab47bc',
          'faith': '#78909c',
        },
      },
      fontFamily: {
        'display': ['Cinzel', 'Georgia', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(201, 162, 39, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(201, 162, 39, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}

