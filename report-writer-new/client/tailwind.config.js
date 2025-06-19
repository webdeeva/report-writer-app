/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#800000', // Dark red
          light: '#a52a2a',   // Lighter red
          dark: '#600000',    // Darker red
        },
        secondary: {
          DEFAULT: '#4A4A4A', // Dark gray
          light: '#6A6A6A',   // Lighter gray
          dark: '#2A2A2A',    // Darker gray
        },
        background: {
          DEFAULT: '#FFFFFF', // White
          alt: '#F9F9F9',     // Light gray
        },
        card: {
          hearts: '#8B0000',  // Dark red for hearts
          diamonds: '#8B0000', // Dark red for diamonds
          spades: '#000000',  // Black for spades
          clubs: '#000000',   // Black for clubs
          border: '#C53030',  // Border color for cards
        }
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        card: '8px',
      },
    },
  },
  plugins: [],
}
