/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
colors: {
        primary: "#3B82F6",
        secondary: "#6B7280", 
        accent: "#EFF6FF",
        surface: "#FFFFFF",
        background: "#F9FAFB",
        success: "#22C55E",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        scandinavian: {
          blue: "#3B82F6",
          gray: "#6B7280",
          lightBlue: "#EFF6FF", 
          lightGray: "#F9FAFB",
          darkGray: "#374151",
          white: "#FFFFFF"
        }
      },
backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
        'gradient-surface': 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
        'gradient-background': 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
        'gradient-accent': 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        'gradient-success': 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        'gradient-header': 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
        'gradient-scandinavian': 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 100%)'
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
        'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'active': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'scandinavian': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'subtle': '0 1px 2px rgba(59, 130, 246, 0.1)'
      },
animation: {
        'confetti': 'confetti 1s ease-out',
        'progress': 'progress 0.5s ease-out', 
        'bounce-subtle': 'bounce-subtle 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.3s ease-out'
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
        },
'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: [],
}