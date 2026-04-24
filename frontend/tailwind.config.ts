// Emmanuel Aro's project submission for evaluation.
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    // Hard reset: every Tailwind radius utility resolves to 0 so the entire
    // surface area of the app honours the "no border-radius" design rule.
    borderRadius: {
      none: "0px",
      sm: "0px",
      DEFAULT: "0px",
      md: "0px",
      lg: "0px",
      xl: "0px",
      "2xl": "0px",
      "3xl": "0px",
      full: "0px",
    },
    extend: {
      colors: {
        // Nativetalk brand
        brand: {
          DEFAULT: "#16A34A",   // primary green (buttons, active state, accent)
          50:  "#ECFDF5",
          100: "#D1FAE5",
          200: "#A7F3D0",
          500: "#16A34A",
          600: "#15803D",
          700: "#166534",
        },
        ink: {
          DEFAULT: "#0F172A",
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        // Status / priority palette (matches Figma chips)
        status: {
          highBg:       "#FEE2E2", highFg:       "#B91C1C",
          mediumBg:     "#FEF3C7", mediumFg:     "#B45309",
          lowBg:        "#F1F5F9", lowFg:        "#475569",
          inProgressBg: "#DBEAFE", inProgressFg: "#1D4ED8",
          doneBg:       "#DCFCE7", doneFg:       "#15803D",
          overdueBg:    "#FFEDD5", overdueFg:    "#C2410C",
          todoBg:       "#F1F5F9", todoFg:       "#475569",
        },
        // Metric icon tile backgrounds
        tile: {
          green:  "#DCFCE7",
          blue:   "#DBEAFE",
          purple: "#EDE9FE",
          red:    "#FEE2E2",
        },
        canvas: "#F7F8FA",
        line:   "#E5E7EB",
        surface:"#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(15, 23, 42, 0.04), 0 1px 2px 0 rgba(15, 23, 42, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
