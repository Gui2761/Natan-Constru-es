/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design System: The Premium Dark Blueprint
        primary: '#00345f', // Azul Deep Natan
        secondary: '#fd8121', // Laranja Blueprint
        background: '#040b14', // Deep Dark Slate Navy (Fundo geral)
        surface: '#091321', // Dark Navy Card (Superfície)
        'surface-container': '#0f1f33', // Container secundário mais claro
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-surface': '#f1f5f9', // Texto claro (Slate 100)
        'outline': '#94a3b8', // Texto secundário (Slate 400)
        'outline-variant': '#1e293b', // Bordas escuras (Slate 800)
      },
      fontFamily: {
        headline: ['Work Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'blueprint': '0 4px 20px 0 rgba(0, 52, 95, 0.25)',
      }
    },
  },
  plugins: [],
}
