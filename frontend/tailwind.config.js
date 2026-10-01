/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        strong: '#22c55e',
        intermediate: '#eab308',
        weak: '#64748b',
      }
    }
  },
  plugins: []
}
