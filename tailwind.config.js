/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: "#5B4FE9",
        secondary: "#8B7FF5",
        accent: "#FF6B6B",
        surface: "#FFFFFF",
        background: "#F8F9FB",
        success: "#4ECDC4",
        warning: "#FFD93D",
        error: "#FF6B6B",
        info: "#4D96FF"
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #5B4FE9 0%, #8B7FF5 100%)',
        'gradient-surface': 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FB 100%)',
        'gradient-background': 'linear-gradient(135deg, #F8F9FB 0%, #E8EAF0 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
        'gradient-success': 'linear-gradient(135deg, #4ECDC4 0%, #6EE7E0 100%)',
        'gradient-header': 'linear-gradient(135deg, #FFFFFF 0%, #F1F3F9 50%, #E8EAF0 100%)'
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem"
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'active': '0 2px 8px rgba(91, 79, 233, 0.3)'
      },
      animation: {
        'confetti': 'confetti 1s ease-out',
        'progress': 'progress 0.5s ease-out',
        'bounce-subtle': 'bounce-subtle 0.3s ease-out'
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '0' }
        },
        progress: {
          '0%': { transform: 'scale(0.8)', opacity: '0.6' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'bounce-subtle': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' }
        }
      }
    }
  },
  plugins: [],
}