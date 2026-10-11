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
          dark: '#090d16',
          card: '#111827',
          border: '#1f293d',
        }
      },
      boxShadow: {
        neon: '0 0 20px rgba(16, 185, 129, 0.15)',
      }
    },
  },
  plugins: [],
}