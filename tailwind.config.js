/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Australian Betting Theme Colors
      colors: {
        navy: {
          DEFAULT: '#1a237e',
          light: '#3949ab',
        },
        golden: {
          DEFAULT: '#ffc107',
          light: '#ffca28',
        },
        emerald: {
          DEFAULT: '#00c853',
          light: '#26a69a',
        },
        coral: {
          DEFAULT: '#ff5722',
          light: '#ff7043',
        },
      },
      // Enhanced Typography
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Enhanced Border Radius
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      // Enhanced Shadows
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 20px 0 rgba(0, 0, 0, 0.15)',
        'large': '0 10px 40px 0 rgba(0, 0, 0, 0.2)',
        'xl': '0 20px 50px 0 rgba(0, 0, 0, 0.25)',
      },
      // Enhanced Animations
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in': 'slideIn 0.6s ease-out',
        'pulse-soft': 'pulse 2s ease-in-out infinite',
        'bounce-soft': 'bounce 1s ease-in-out infinite',
      },
      // Enhanced Gradients
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #1a237e, #00c853)',
        'gradient-secondary': 'linear-gradient(135deg, #ffc107, #ff5722)',
        'gradient-accent': 'linear-gradient(135deg, #00c853, #ffc107)',
      },
      // Enhanced Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Enhanced Container
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '1.5rem',
          lg: '2rem',
          xl: '2.5rem',
          '2xl': '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    },
  },
  plugins: [
    // Custom utilities
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Hide scrollbar for Chrome, Safari and Opera */
          '-webkit-scrollbar': 'none',
          /* Hide scrollbar for IE, Edge and Firefox */
          '-ms-overflow-style': 'none',  /* IE and Edge */
          'scrollbar-width': 'none',  /* Firefox */
        }
      })
    }
  ],
} 