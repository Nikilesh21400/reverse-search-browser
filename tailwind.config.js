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
        'chrome-bg': 'hsl(var(--chrome-bg))',
        'chrome-border': 'hsl(var(--chrome-border))',
        'chrome-tab-bg': 'hsl(var(--chrome-tab-bg))',
        'chrome-tab-hover': 'hsl(var(--chrome-tab-hover))',
        'chrome-tab-active': 'hsl(var(--chrome-tab-active))',
        'chrome-address-bg': 'hsl(var(--chrome-address-bg))',
        'chrome-text': 'hsl(var(--chrome-text))',
        'chrome-text-secondary': 'hsl(var(--chrome-text-secondary))',
        'chrome-accent': 'hsl(var(--chrome-accent))',
        'chrome-secure': 'hsl(var(--chrome-secure))',
        'chrome-favicon': 'hsl(var(--chrome-favicon))',
      },
      fontFamily: {
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'chrome': 'var(--chrome-shadow)',
      }
    },
  },
  plugins: [],
}
