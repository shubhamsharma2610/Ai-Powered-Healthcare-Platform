/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Aapka Logo Color: hsl(182, 100%, 37%)
        primary: {
          light: 'hsl(182, 100%, 95%)', // Bahut light (backgrounds ke liye)
          DEFAULT: 'hsl(182, 100%, 37%)', // Main Logo Color
          dark: 'hsl(182, 100%, 25%)',   // Hover states ke liye
        },
        secondary: {
          DEFAULT: '#2a6f7c', // Muted Teal (Professional look)
        },
         ternary: {
          DEFAULT: '#d3ebf5', // Muted Teal (Professional look)
        },
        accent: {
          DEFAULT: '#ff6b6b', // Emergency ya Alert buttons ke liye (soft red)
        },
        background: {
          soft: '#f8fafc',    // Page background
          card: '#ffffff',    // White for cards
        }
      },
      fontFamily: {
        // Healthcare projects ke liye "Inter" ya "Outfit" best rehti hain
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'sans-serif'], // Headings ke liye professional font
      },
      spacing: {
        // Detailed padding/margin control
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        'section': '80px', // Standard section spacing
      },
      borderRadius: {
        'medical': '12px', // Healthcare UI mein soft corners ache lagte hain
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)', // Clean card shadows
      }
    },
  },
  plugins: [],
}