import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF0EC',
          100: '#FAD9CF',
          200: '#F4A990',
          300: '#EC7450',
          400: '#DE5030',
          DEFAULT: '#B5341A',
          600: '#942912',
          700: '#731F0D',
          800: '#521408',
          900: '#360D04',
        },
        secondary: {
          50: '#F5EEE8',
          100: '#E8D5C5',
          200: '#C9A688',
          300: '#A6744C',
          400: '#6B3A1C',
          DEFAULT: '#3D1A0B',
          600: '#2E1308',
          700: '#200D05',
          800: '#140803',
          900: '#0A0401',
        },
        elevated: '#FFFCF9',
        canvas: '#FDFAF7',
        soft: '#FAF7F3',
        blush: '#F3EBE3',
        warm: {
          50: '#FDFAF7',
          100: '#F6F0E9',
          150: '#F0E8DF',
          200: '#E8DDD2',
          300: '#D4B89A',
          400: '#B8916D',
          500: '#8C6340',
        },
        ink: '#1A0A05',
        brand: {
          red: '#B5341A',
          'red-light': '#CE4B2A',
          'red-dark': '#8B2712',
          brown: '#3D1A0B',
        },
        faculty: {
          management: '#B5341A',
          digital: '#8B2712',
          governance: '#3D1A0B',
          health: '#CE4B2A',
        },
      },
      fontFamily: {
        display: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2rem, 3.2vw + 0.5rem, 3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-lg': ['clamp(1.625rem, 2.2vw + 0.5rem, 2.375rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.35rem, 1.4vw + 0.5rem, 1.875rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
      },
      maxWidth: {
        container: '1280px',
        prose: '72ch',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        card: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(61, 26, 11, 0.05), 0 1px 2px rgba(61, 26, 11, 0.04)',
        'card-hover': '0 8px 28px -6px rgba(61, 26, 11, 0.14)',
        soft: '0 8px 24px -6px rgba(61, 26, 11, 0.08)',
        glow: '0 0 0 1px rgba(181, 52, 26, 0.08), 0 8px 32px -8px rgba(181, 52, 26, 0.22)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        slow: '400ms',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out both',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'float-slower': 'floatSlow 11s ease-in-out infinite reverse',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '0.85' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
