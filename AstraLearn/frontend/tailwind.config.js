// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        dark: '#0F172A',
        lightDark: '#1E293B'
      }
    },
  },
  plugins: [],
}