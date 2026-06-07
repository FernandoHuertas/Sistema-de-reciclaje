/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'eco-dark': '#1F5C3E',
        'eco-accent': '#4ADE80',
        'eco-bg': '#F0FDF4',
        'eco-text': '#1A2E1A',
      }
    },
  },
  plugins: [],
}
