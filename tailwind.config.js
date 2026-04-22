/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        softBeige: '#f5f1e6',
        primaryBlue: '#0284c7',
        primaryBlueDark: '#0369a1',
        primaryBlueLight: '#e0f2fe',
        textDark: '#1e293b',
        textMuted: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}