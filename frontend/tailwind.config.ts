import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Marca
        primary: {
          50:  "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#2DD4BF",
          500: "#14B8A6", // base
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
        },
        coral: {
          50:  "#FFF1F2",
          100: "#FFE4E6",
          200: "#FECDD3",
          300: "#FDA4AF",
          400: "#FB7185", // base
          500: "#F43F5E",
          600: "#E11D48",
          700: "#BE123C",
        },
        // Neutrales
        bg:        "#F8FAFC",
        surface:   "#FFFFFF",
        text:      "#0F172A",
        "text-muted": "#64748B",
        "text-soft":  "#94A3B8",
        border:    "#E2E8F0",
        "border-light": "#F1F5F9",
        // Estados
        success: "#10B981",
        warning: "#F59E0B",
        danger:  "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        sm:  "0 1px 2px rgba(15,23,42,0.04)",
        DEFAULT: "0 4px 12px rgba(15,23,42,0.06)",
        lg:  "0 10px 30px rgba(15,23,42,0.08)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
