/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ✅ Primary teal — full scale
        primary: {
          50:  'hsl(182, 80%, 96%)',
          100: 'hsl(182, 75%, 88%)',
          200: 'hsl(182, 70%, 72%)',
          400: 'hsl(182, 65%, 55%)',
          DEFAULT: 'hsl(182, 100%, 37%)', // logo color
          600: 'hsl(182, 100%, 30%)',
          700: 'hsl(182, 100%, 25%)',
          900: 'hsl(182, 90%, 16%)',
        },

        // ✅ Secondary muted teal
        secondary: {
          DEFAULT: '#2a6f7c',
          light: '#e0f2f7',
          dark: '#1a4f5a',
        },

        // ✅ Surface (ternary rename — zyada semantic)
        surface: {
          DEFAULT: '#d3ebf5',
          muted: '#f0f9ff',
          soft: '#f8fafc',
        },

        // ✅ Status colors — medical UI ke liye ZAROOR chahiye
        success: {
          light: '#dcfce7',
          DEFAULT: '#16a34a',
          dark: '#15803d',
        },
        warning: {
          light: '#fef9c3',
          DEFAULT: '#ca8a04',
          dark: '#a16207',
        },
        danger: {
          light: '#fee2e2',
          DEFAULT: '#dc2626',  // ← #ff6b6b se replace karo
          dark: '#b91c1c',
        },
        info: {
          light: '#eff6ff',
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
        },

        // ✅ Neutral gray scale (borders, text, disabled)
        gray: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'], // headings ke liye
      },

      fontSize: {
        // ✅ Medical UI typography scale
        'xs':   ['11px', { lineHeight: '16px' }],
        'sm':   ['13px', { lineHeight: '20px' }],
        'base': ['15px', { lineHeight: '24px' }],
        'md':   ['16px', { lineHeight: '26px' }],
        'lg':   ['18px', { lineHeight: '28px' }],
        'xl':   ['20px', { lineHeight: '30px' }],
        '2xl':  ['24px', { lineHeight: '34px' }],
        '3xl':  ['30px', { lineHeight: '40px' }],
      },

      borderRadius: {
        'sm':      '6px',
        'medical': '12px', // cards, modals
        'pill':    '999px', // badges, status chips
      },

      boxShadow: {
        'soft':    '0 2px 8px -1px rgba(0,0,0,0.06)',
        'card':    '0 4px 20px -2px rgba(0,0,0,0.08)',
        'hover':   '0 8px 30px -4px rgba(0,0,0,0.12)',
        'primary': '0 4px 14px 0 hsl(182,100%,37%,0.25)', // teal glow for CTA
      },

      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        'section': '80px',
      },
    },
  },
  plugins: [],
}