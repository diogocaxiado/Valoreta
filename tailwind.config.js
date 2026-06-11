/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'valorant': ['Valorant-Font', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'prompt': ['Prompt', 'sans-serif'],
      },
      colors: {
        'valorant-red': '#ff4654',
        'valorant-purple': '#825e7d',
        'valorant-yellow': 'rgb(227, 227, 143)',
        'valorant-light': 'rgb(227, 227, 200)',
        'valorant-green': 'rgba(30, 255, 60, 1)',
        'valorant-cyan': 'rgba(0, 255, 255, 0.8)',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        '8xl': '8.2rem',
        'display': ['6rem', { lineHeight: '1', letterSpacing: '0.1em' }],
        'h1': ['4.5rem', { lineHeight: '1', letterSpacing: '0.05em' }],
        'h2': ['3rem', { lineHeight: '1.1', letterSpacing: '0.05em' }],
        'h3': ['2.25rem', { lineHeight: '1.2', letterSpacing: '0.025em' }],
        'h4': ['1.5rem', { lineHeight: '1.3', letterSpacing: '0.025em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75', letterSpacing: '0em' }],
        'body': ['1rem', { lineHeight: '1.5', letterSpacing: '0em' }],
        'small': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0em' }],
        'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0em' }],
      },
      letterSpacing: {
        '4': '4px',
        '2': '2px',
        '1': '1px',
      },
      backdropBlur: {
        'xs': '2px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
