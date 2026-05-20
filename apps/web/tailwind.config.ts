import type { Config } from 'tailwindcss';

// ════════════════════════════════════════════════════════
// UNM OFFICIAL BRAND PALETTE — extracted from the UNM logo.
//   Primary Red:  #B5341A  (terracotta/brick red — logo letters)
//   Dark Brown:   #3D1A0B  (deep chocolate — letter depth, mortarboard)
// Tokens defined here are the single source of truth for the brand.
// Any deviation from these colors is forbidden by the brand guidelines.
// ════════════════════════════════════════════════════════

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary — UNM terracotta/brick red (logo main color)
        primary: {
          50: '#FDF0EC',
          100: '#FAD9CF',
          200: '#F4A990',
          300: '#EC7450',
          400: '#DE5030',
          DEFAULT: '#B5341A', // ← LOGO PRIMARY RED
          600: '#942912',
          700: '#731F0D',
          800: '#521408',
          900: '#360D04',
        },
        // Secondary — UNM dark chocolate brown (logo shadow/depth)
        secondary: {
          50: '#F5EEE8',
          100: '#E8D5C5',
          200: '#C9A688',
          300: '#A6744C',
          400: '#6B3A1C',
          DEFAULT: '#3D1A0B', // ← LOGO DARK BROWN
          600: '#2E1308',
          700: '#200D05',
          800: '#140803',
          900: '#0A0401',
        },
        // Warm neutrals — replace pure whites/grays for warmth
        warm: {
          50: '#FDFAF7',
          100: '#F5EFE8',
          200: '#EAD9C9',
          300: '#D4B89A',
          400: '#B8916D',
          500: '#8C6340',
        },
        // Semantic tokens
        ink: '#1A0A05', // body text — very dark warm tone (not pure black)
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
        // Editorial serif for headlines (NYT / Bloomberg / Wharton style).
        // Source Serif 4 is more contemporary than Garamond, less "wedding font".
        display: ['"Source Serif 4"', '"Source Serif Pro"', 'Georgia', 'serif'],
        // Inter for everything else — institutional default used by Stanford
        // GSB, Stripe, INSEAD-like setups. `heading` and `body` aliases kept
        // for backward compatibility with existing classes.
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Institutional scale — ~30% smaller than the previous showroom
        // sizes. Tracking is tight on display sizes (HBS / Wharton style).
        // Institutional editorial scale — ~25-30% smaller than the previous
        // values. Closer to FT / Bloomberg / Wharton sizing than to SaaS
        // landing pages.
        'display-xl': ['clamp(1.625rem, 2.4vw + 0.5rem, 2.5rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(1.375rem, 1.6vw + 0.5rem, 2rem)',    { lineHeight: '1.18', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.25rem, 1vw + 0.5rem, 1.625rem)',   { lineHeight: '1.25', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        container: '1280px',
        prose: '72ch',
      },
      borderRadius: {
        // Institutional schools rarely use heavy rounding. Keep things crisp.
        DEFAULT: '0.25rem',
        card: '0.375rem',
      },
      boxShadow: {
        // Very subtle elevation — closer to NYT/Bloomberg than SaaS landing pages.
        card: '0 1px 2px rgba(61, 26, 11, 0.04), 0 1px 1px rgba(61, 26, 11, 0.06)',
        'card-hover': '0 4px 12px -4px rgba(61, 26, 11, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
