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
        // Architectural palette: deep ink, neutral surfaces, decisive accents
        ink: {
          DEFAULT: "#0B0F14",
          50: "#F5F6F7",
          100: "#E7E9EC",
          200: "#C9CDD3",
          300: "#9BA3AC",
          400: "#646F7C",
          500: "#3F4954",
          600: "#27313B",
          700: "#171F28",
          800: "#0F1620",
          900: "#0B0F14",
        },
        accent: {
          DEFAULT: "#1F6FEB",
          soft: "#E8F0FE",
        },
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        info: "#0891B2",
        surface: "#FFFFFF",
        canvas: "#F4F5F7",
        line: "#E5E7EB",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(15, 22, 32, 0.04), 0 1px 2px 0 rgba(15, 22, 32, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
