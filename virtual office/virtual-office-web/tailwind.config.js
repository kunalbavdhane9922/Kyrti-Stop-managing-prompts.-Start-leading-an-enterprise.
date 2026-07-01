/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sovereign: {
          bg: '#0A0A0A',
          surface: '#111111', 
          surfaceHover: '#1A1A1A',
          border: '#2A2A2A',
          indigo: '#5E6AD2',
          emerald: '#10B981',
          text: '#EEEEEE',
          muted: '#888888',
        }
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'neon-indigo': '0 0 20px rgba(94, 106, 210, 0.4)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular'],
      },
    },
  },
  plugins: [],
}
