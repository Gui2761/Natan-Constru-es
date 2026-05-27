/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Ativa o modo escuro baseado na classe 'dark' no html/body
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vincula as cores do design system às variáveis CSS dinâmicas (Suporta Light e Dark Mode)
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-container': 'var(--color-surface-container)',
        'on-primary': '#ffffff',
        'on-secondary': '#ffffff',
        'on-surface': 'var(--color-on-surface)',
        'outline': 'var(--color-outline)',
        'outline-variant': 'var(--color-outline-variant)',
      },
      fontFamily: {
        headline: ['Work Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'blueprint': '0 4px 20px 0 rgba(0, 52, 95, 0.15)',
      }
    },
  },
  plugins: [],
}
