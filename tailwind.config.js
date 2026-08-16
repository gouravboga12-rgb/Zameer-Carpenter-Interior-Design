/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: "#FDFBF7",         // Primary warm ivory
          surface: "#F4F0EA",    // Secondary architectural beige
          card: "#FFFDF9",       // Card background
          walnut: "#1E1B18",     // Deep walnut
          charcoal: "#2B231D",   // Charcoal ebony
          slate: "#3E352F",      // Medium charcoal slate
          muted: "#756B61",      // Muted neutral text
          border: "#E7DFC6",     // Soft gold/ivory border
          gold: {
            DEFAULT: "#D4AF37",  // Pure gold accent
            light: "#F3E8D2",    // Soft champagne tint
            warm: "#C5A880",     // Champagne brass
            dark: "#A68222",     // Deep burnished gold
            shimmer: "#F9F3E5"   // Subtle glow tint
          }
        }
      },
      fontFamily: {
        heading: ["'Playfair Display'", "'Cinzel'", "Georgia", "serif"],
        cinzel: ["'Cinzel'", "Georgia", "serif"],
        body: ["'Plus Jakarta Sans'", "'Inter'", "system-ui", "sans-serif"],
        script: ["'Great Vibes'", "cursive"]
      },
      boxShadow: {
        'luxury': '0 10px 30px -10px rgba(30, 27, 24, 0.08), 0 4px 6px -2px rgba(30, 27, 24, 0.03)',
        'luxury-hover': '0 20px 40px -15px rgba(212, 175, 55, 0.15), 0 10px 20px -5px rgba(30, 27, 24, 0.08)',
        'gold-glow': '0 0 25px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 40px rgba(212, 175, 55, 0.35)',
        'inner-gold': 'inset 0 0 15px rgba(212, 175, 55, 0.15)'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F3E8D2 50%, #C5A880 100%)',
        'gold-metallic': 'linear-gradient(135deg, #ECC94B 0%, #D4AF37 40%, #A68222 100%)',
        'walnut-gradient': 'linear-gradient(180deg, #1E1B18 0%, #2B231D 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(30, 27, 24, 0.75) 0%, rgba(30, 27, 24, 0.45) 50%, rgba(30, 27, 24, 0.85) 100%)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      }
    },
  },
  plugins: [],
}
