/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'tungsten': ['Tungsten-Font', 'sans-serif'],
        'prompt': ['Prompt', 'sans-serif'],
      },
      colors: {
        'valorant-red': '#ff4654',
        'valorant-purple': '#825e7d',
        'valorant-yellow': 'rgb(227, 227, 143)',
        'valorant-light': 'rgb(227, 227, 200)',
        'valorant-green': 'rgba(30, 255, 60, 1)',
        'valorant-cyan': 'rgba(0, 255, 255, 0.8)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        '8xl': '8.2rem',
      },
      letterSpacing: {
        '4': '4px',
        '2': '2px',
        '1': '1px',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
