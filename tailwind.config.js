/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System: The Architectural Blueprint
        primary: '#00345f', // Azul Deep
        secondary: '#fd8121', // Laranja Blueprint
        background: '#f9f9fd',
        surface: '#ffffff',
        'surface-container': '#eeedf2',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-surface': '#1a1c1f',
        'outline': '#737780',
        'outline-variant': '#c2c6d0',
      },
      fontFamily: {
        headline: ['Work Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'blueprint': '0 4px 14px 0 rgba(0, 52, 95, 0.1)',
      }
    },
  },
  plugins: [],
}
