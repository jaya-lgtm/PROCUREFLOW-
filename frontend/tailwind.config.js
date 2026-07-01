/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6',
          hover: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#1E293B',
          dark: '#0F172A',
          light: '#334155',
        },
        success: {
          DEFAULT: '#10B981',
          hover: '#059669',
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#DC2626',
        },
        aiAccent: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
        },
        bgLight: '#F8FAFC',
        bgDark: '#0B0F19',
        cardLight: '#FFFFFF',
        cardDark: '#1E293B',
        textLight: '#111827',
        textDark: '#F9FAFB',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
