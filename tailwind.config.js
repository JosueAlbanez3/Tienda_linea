/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6F00',
        secondary: '#1E88E5', 
        accent: '#43A047',
        background: '#F5F5F5',
      }
    },
  },
  plugins: [],
}