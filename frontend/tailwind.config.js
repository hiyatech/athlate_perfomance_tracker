/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FAFAF8',
          accent: '#2FA84F',
          'accent-hover': '#25893F',
          'accent-light': '#EAF7ED',
          charcoal: '#2B2B28',
          muted: '#6B6B66',
          border: '#E5E5E0',
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        'card': '12px'
      }
    },
  },
  plugins: [],
}
