/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {

      // ── Colors — "Warm Luxury Neutral" ──────────────────────
      colors: {
        // Backgrounds
        'bg-primary':    '#FAFAF8',
        'bg-secondary':  '#F5F4F0',
        'bg-elevated':   '#FFFFFF',
        'bg-dark':       '#1A1A1A',

        // Warm Neutral Grays
        'warm': {
          50:  '#FAFAF8',
          100: '#F5F4F0',
          200: '#E8E7E3',
          300: '#D4D3CE',
          400: '#A09F99',
          500: '#6E6D66',
          600: '#4A4943',
          700: '#2E2D28',
          800: '#1A1A16',
          900: '#0F0F0C',
        },

        // Accent — Warm Gold-Rose (CTAs)
        'accent': {
          DEFAULT: '#C8956C',
          hover:   '#B07D55',
          light:   '#F0E2D6',
          dark:    '#8F5C35',
        },

        // Text
        'text-primary':     '#1A1A16',
        'text-secondary':   '#6E6D66',
        'text-placeholder': '#A09F99',
        'text-on-dark':     '#F5F4F0',
      },

      // ── Typography ───────────────────────────────────────────
      fontFamily: {
        heading: ['"Playfair Display"', 'Georgia', 'Times New Roman', 'serif'],
        body:    ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        accent:  ['"Cormorant Garamond"', 'Garamond', 'Georgia', 'serif'],
        mono:    ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },

      fontSize: {
        'display': ['4rem', { lineHeight: '4.5rem', fontWeight: '700' }],   // 64px
        'h1':      ['3rem', { lineHeight: '3.5rem', fontWeight: '700' }],   // 48px
        'h2':      ['2.25rem', { lineHeight: '2.75rem', fontWeight: '600' }], // 36px
        'h3':      ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],   // 24px
        'h4':      ['1.25rem', { lineHeight: '1.75rem', fontWeight: '500' }], // 20px
        'body':    ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],   // 16px
        'sm':      ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }], // 14px
        'label':   ['0.75rem', { lineHeight: '1rem', fontWeight: '500', letterSpacing: '0.05em' }], // 12px
      },

      // ── Spacing (4px base) ──────────────────────────────────
      spacing: {
        '4.5':  '1.125rem', // 18px
        '13':   '3.25rem',  // 52px
        '15':   '3.75rem',  // 60px
        '17':   '4.25rem',  // 68px
        '18':   '4.5rem',   // 72px
        '22':   '5.5rem',   // 88px
        '26':   '6.5rem',   // 104px
        '30':   '7.5rem',   // 120px
        '34':   '8.5rem',   // 136px
        'sidebar-left':  '280px',
        'sidebar-right': '260px',
        'toolbar':       '56px',
        'page-nav':      '80px',
      },

      // ── Border Radius ────────────────────────────────────────
      borderRadius: {
        'sm':  '6px',
        'md':  '8px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '20px',
        '3xl': '24px',
      },

      // ── Box Shadow ──────────────────────────────────────────
      boxShadow: {
        'card':     '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.12)',
        'modal':    '0 25px 50px rgba(0,0,0,0.25)',
        'toolbar':  '0 1px 0 rgba(0,0,0,0.08)',
        'sidebar':  '1px 0 0 rgba(0,0,0,0.06)',
        'page':     '0 4px 24px rgba(0,0,0,0.15)',
        'accent':   '0 4px 12px rgba(200,149,108,0.3)',
      },

      // ── Transitions ──────────────────────────────────────────
      transitionDuration: {
        'fast':   '100ms',
        'normal': '200ms',
        'slow':   '300ms',
      },

      // ── Max Width ────────────────────────────────────────────
      maxWidth: {
        'content':  '1280px',
        'wide':     '1440px',
        'narrow':   '640px',
      },

      // ── Z-Index ──────────────────────────────────────────────
      zIndex: {
        'toolbar':  '100',
        'sidebar':  '90',
        'dropdown': '200',
        'modal':    '300',
        'toast':    '400',
        'tooltip':  '500',
      },

      // ── Animation ────────────────────────────────────────────
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'snap-in': {
          '0%':   { transform: 'scale(0.95)', opacity: '0.8' },
          '60%':  { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in':  'fade-in 200ms ease-out',
        'slide-up': 'slide-up 250ms ease-out',
        'snap-in':  'snap-in 250ms ease-out',
        'shimmer':  'shimmer 1.5s infinite linear',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
