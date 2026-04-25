import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0f2746",
          light: "#1d3f6e",
          dark: "#081a31",
        },
        charcoal: "#1c1917",
        "green-campus": "#166534",
        luxury: {
          black: "#0a0a0a",
          charcoal: "#1a1a1a",
          stone: "#f5f5f0",
          gold: "#D4AF37",
          "gold-light": "#EEDEA8",
          "gold-dark": "#AA882E",
        }
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      animation: {
        'slow-pan': 'pan 20s linear infinite',
      },
      keyframes: {
        pan: {
          '0%': { transform: 'scale(1.05) translate(0, 0)' },
          '50%': { transform: 'scale(1.1) translate(-1%, -1%)' },
          '100%': { transform: 'scale(1.05) translate(0, 0)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
