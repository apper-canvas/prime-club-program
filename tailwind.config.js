/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: "#E91E63",
        secondary: "#0EA5E9", 
        accent: "#EAB308",
        surface: "#FFFFFF",
        background: "#F0F0F0",
        success: "#22C55E",
        warning: "#EAB308",
        error: "#E91E63",
        info: "#0EA5E9",
        memphis: {
          pink: "#E91E63",
          blue: "#0EA5E9",
          yellow: "#EAB308", 
          green: "#22C55E",
          purple: "#8B5CF6",
          orange: "#F97316"
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #E91E63 0%, #EAB308 100%)',
        'gradient-surface': 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)',
        'gradient-background': 'linear-gradient(135deg, #F0F0F0 0%, #E0E0E0 100%)',
        'gradient-accent': 'linear-gradient(135deg, #EAB308 0%, #E91E63 100%)',
        'gradient-success': 'linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)',
        'gradient-header': 'linear-gradient(135deg, #FFFFFF 0%, #EAB308 25%, #E91E63 75%, #0EA5E9 100%)',
        'gradient-memphis': 'linear-gradient(45deg, #E91E63 0%, #0EA5E9 25%, #EAB308 50%, #22C55E 75%, #8B5CF6 100%)',
        'gradient-neon': 'linear-gradient(90deg, #E91E63 0%, #0EA5E9 50%, #EAB308 100%)'
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
        'card': '0 4px 8px rgba(233, 30, 99, 0.15)',
        'hover': '0 8px 16px rgba(14, 165, 233, 0.2)',
        'active': '0 4px 12px rgba(234, 179, 8, 0.25)',
        'memphis': '6px 6px 0px #E91E63, 12px 12px 0px #0EA5E9',
        'neon': '0 0 15px rgba(233, 30, 99, 0.3), 0 0 30px rgba(14, 165, 233, 0.2)'
      },
      animation: {
        'confetti': 'confetti 1s ease-out',
        'progress': 'progress 0.5s ease-out', 
        'bounce-subtle': 'bounce-subtle 0.3s ease-out',
        'memphis-float': 'memphis-float 3s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate'
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
        'memphis-float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' }
        },
        'neon-pulse': {
          '0%': { boxShadow: '0 0 4px #E91E63, 0 0 8px #E91E63, 0 0 12px #E91E63' },
          '100%': { boxShadow: '0 0 8px #0EA5E9, 0 0 16px #0EA5E9, 0 0 24px #0EA5E9' }
        }
      }
    }
  },
  plugins: [],
}