import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#d9e6ff",
          200: "#bcd3ff",
          300: "#8eb6ff",
          400: "#598dff",
          500: "#3366ff",
          600: "#1f48f5",
          700: "#1736e1",
          800: "#192fb6",
          900: "#1a2f8f",
          950: "#151d57",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(16 24 40 / 0.04), 0 1px 3px 0 rgb(16 24 40 / 0.06)",
        "card-hover":
          "0 12px 28px -8px rgb(16 24 40 / 0.16), 0 4px 10px -4px rgb(16 24 40 / 0.08)",
        soft: "0 1px 0 0 rgb(16 24 40 / 0.04)",
        ring: "0 0 0 1px rgb(16 24 40 / 0.04), 0 2px 8px -2px rgb(16 24 40 / 0.08)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3366ff 0%, #1f48f5 100%)",
        "sidebar-gradient": "linear-gradient(180deg, #0f172a 0%, #0b1326 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
