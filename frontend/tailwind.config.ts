// Emmanuel Aro's project submission for evaluation.
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4d6bfe",
          soft: "#4d6bfe80",
          glow: "#76e8ff",
        },
        accent: {
          DEFAULT: "#76e8ff",
        },
        fg: {
          DEFAULT: "#ffffff",
          muted: "rgba(255, 255, 255, 0.7)",
          subtle: "rgba(255, 255, 255, 0.4)",
        },
        bg: {
          DEFAULT: "#07040c",
          soft: "rgba(7, 4, 12, 0.6)",
        },
        ink: {
          DEFAULT: "#ffffff",
          50: "#0F172A",
          100: "#1E293B",
          200: "#334155",
          300: "#475569",
          400: "#64748B",
          500: "#94A3B8",
          600: "#CBD5E1",
          700: "#E2E8F0",
          800: "#F1F5F9",
          900: "#F8FAFC",
        },
        status: {
          highBg:       "rgba(185, 28, 28, 0.2)", highFg:       "#FCA5A5",
          mediumBg:     "rgba(180, 83, 9, 0.2)", mediumFg:     "#FDE68A",
          lowBg:        "rgba(255, 255, 255, 0.1)", lowFg:        "#CBD5E1",
          inProgressBg: "rgba(29, 78, 216, 0.2)", inProgressFg: "#93C5FD",
          doneBg:       "rgba(21, 128, 61, 0.2)", doneFg:       "#86EFAC",
          overdueBg:    "rgba(194, 65, 12, 0.2)", overdueFg:    "#FDBA74",
          todoBg:       "rgba(255, 255, 255, 0.1)", todoFg:       "#CBD5E1",
        },
        tile: {
          green:  "rgba(21, 128, 61, 0.15)",
          blue:   "rgba(29, 78, 216, 0.15)",
          purple: "rgba(109, 40, 217, 0.15)",
          red:    "rgba(185, 28, 28, 0.15)",
        },
        canvas: "#07040c",
        line:   "rgba(255, 255, 255, 0.1)",
        surface:"rgba(255, 255, 255, 0.03)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 4px 24px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        brand: "0 0 25px rgba(77, 107, 254, 0.5)",
        soft: "0 4px 12px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "float-soft": "float-soft 3s ease-in-out infinite",
        "pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "nebula-drift-a": "nebula-drift-a 20s infinite alternate",
        "nebula-drift-b": "nebula-drift-b 25s infinite alternate",
        "nebula-drift-c": "nebula-drift-c 30s infinite alternate",
      },
      keyframes: {
        "float-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "nebula-drift-a": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(5%, 10%) scale(1.1)" },
        },
        "nebula-drift-b": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(-5%, 8%) scale(1.15)" },
        },
        "nebula-drift-c": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "100%": { transform: "translate(8%, -5%) scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
