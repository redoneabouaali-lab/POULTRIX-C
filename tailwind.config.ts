import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dajaj: {
          aqua: "#C4893A",
          blue: "#2D5541",
          cream: "#F5EDE3",
          gold: "#BF7A5A",
        },
        surface: {
          DEFAULT: "#f8f8fa",
          card: "#ffffff",
          dark: "#f0f0f2",
        },
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        masko: ["Masko", "system-ui", "sans-serif"],
        midland: ["Midlandluxury", "Georgia", "serif"],
        mono: ["Geist Mono", "JetBrains Mono", "monospace"],
        chiken: ["ChikenSteeak", "Masko", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        ripple: "ripple 2s ease calc(var(--i, 0) * 0.2s) infinite",
        orbit: "orbit calc(var(--duration) * 1s) linear infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "float": "float 7s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.8) rotateX(10deg)" },
          to: { opacity: "1", transform: "scale(1) rotateX(0deg)" },
        },
        ripple: {
          "0%, 100%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -50%) scale(0.9)" },
        },
        orbit: {
          "0%": { transform: "rotate(0deg) translateY(calc(var(--radius) * 1px)) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateY(calc(var(--radius) * 1px)) rotate(-360deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "33%": { transform: "translateY(-14px)" },
          "66%": { transform: "translateY(6px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [
    require('lightswind/plugin'),],
};

export default config;
