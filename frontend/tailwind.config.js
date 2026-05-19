/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Google Sans', 'Product Sans', 'Inter', 'Roboto', 'Arial', 'sans-serif']
      },
      colors: {
        brand: {
          primary: '#004080',
          'primary-hover': '#003466',
          'bg-start': '#F8FBFF',
          'bg-end': '#EAF4FF',
          surface: '#FFFFFF',
          border: '#CFE3F7'
        },
        primary: {
          DEFAULT: '#004080',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#EAF4FF',
          foreground: '#004080'
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF'
        },
        ring: '#004080',
        background: '#F8FBFF',
        foreground: '#102033',
        muted: {
          DEFAULT: '#EAF4FF',
          foreground: '#49657F'
        }
      },
      backgroundImage: {
        'workspace-gradient': 'linear-gradient(135deg, #F8FBFF 0%, #EAF4FF 100%)'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
