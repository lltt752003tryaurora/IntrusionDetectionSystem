/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        zinc: {
          750: '#333338',
          950: '#0c0c0e',
        }
      },
      backgroundImage: {
      }
    },
  },
  plugins: [],
  important: true,
};
