/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#08111f',
        surface: '#0f2040',
        teal: '#1fb87a',
        danger: '#e85d3a',
        amber: '#d4a843',
        text: '#e8e0d0',
        muted: '#9bafc8',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Source Serif 4', 'serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}