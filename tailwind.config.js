/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: "#FF2D92",
        secondary: "#00D4FF", 
        accent: "#FFE135",
        surface: "#FFFFFF",
        background: "#F0F0F0",
        success: "#32FF32",
        warning: "#FFE135",
        error: "#FF2D92",
        info: "#00D4FF",
        memphis: {
          pink: "#FF2D92",
          blue: "#00D4FF",
          yellow: "#FFE135", 
          green: "#32FF32",
          purple: "#9D4EDD",
          orange: "#FF6B35"
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FF2D92 0%, #FFE135 100%)',
        'gradient-surface': 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)',
        'gradient-background': 'linear-gradient(135deg, #F0F0F0 0%, #E0E0E0 100%)',
        'gradient-accent': 'linear-gradient(135deg, #FFE135 0%, #FF2D92 100%)',
        'gradient-success': 'linear-gradient(135deg, #32FF32 0%, #00D4FF 100%)',
        'gradient-header': 'linear-gradient(135deg, #FFFFFF 0%, #FFE135 25%, #FF2D92 75%, #00D4FF 100%)',
        'gradient-memphis': 'linear-gradient(45deg, #FF2D92 0%, #00D4FF 25%, #FFE135 50%, #32FF32 75%, #9D4EDD 100%)',
        'gradient-neon': 'linear-gradient(90deg, #FF2D92 0%, #00D4FF 50%, #FFE135 100%)'
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
        'card': '0 4px 8px rgba(255, 45, 146, 0.2)',
        'hover': '0 8px 16px rgba(0, 212, 255, 0.3)',
        'active': '0 4px 12px rgba(255, 225, 53, 0.4)',
        'memphis': '8px 8px 0px #FF2D92, 16px 16px 0px #00D4FF',
        'neon': '0 0 20px rgba(255, 45, 146, 0.5), 0 0 40px rgba(0, 212, 255, 0.3)'
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
          '0%': { boxShadow: '0 0 5px #FF2D92, 0 0 10px #FF2D92, 0 0 15px #FF2D92' },
          '100%': { boxShadow: '0 0 10px #00D4FF, 0 0 20px #00D4FF, 0 0 30px #00D4FF' }
        }
      }
    }
  },
  plugins: [],
}