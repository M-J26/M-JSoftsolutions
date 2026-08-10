/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        midnight: '#08111f',
        graphite: '#111827',
        cyanova: '#16d6d9',
        azure: '#2563eb',
        emeraldx: '#10b981',
        platinum: '#eef6ff',
        signal: '#f59e0b'
      },
      boxShadow: {
        glow: '0 24px 80px rgba(22, 214, 217, 0.22)',
        panel: '0 18px 70px rgba(8, 17, 31, 0.14)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
};
