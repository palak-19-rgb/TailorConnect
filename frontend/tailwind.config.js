/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        'slow-pan-zoom': {
          '0%': { transform: 'scale(1) translate(0,0)' },
          '50%': { transform: 'scale(1.05) translate(-20px,-20px)' },
          '100%': { transform: 'scale(1) translate(0,0)' },
        },
      },
      animation: {
        'slow-pan-zoom': 'slow-pan-zoom 30s linear infinite',

      },
      
    },
  },
  plugins: [],
}
