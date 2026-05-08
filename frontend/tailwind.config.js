/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050816',
        panel: '#0b1220',
        signal: '#67e8f9',
        mint: '#34d399',
        warning: '#f59e0b',
        danger: '#fb7185',
      },
      boxShadow: {
        glow: '0 0 60px rgba(103, 232, 249, 0.18)',
      },
    },
  },
  plugins: [],
}
