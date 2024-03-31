import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      myrtle_green: {
        DEFAULT: "#2c7873",
        100: "#091817",
        200: "#12302e",
        300: "#1a4744",
        400: "#235f5b",
        500: "#2c7873",
        600: "#3faaa3",
        700: "#67c7c0",
        800: "#9adad5",
        900: "#ccecea",
      },
      deep_sky_blue: {
        DEFAULT: "#30c5ff",
        100: "#002b3c",
        200: "#005678",
        300: "#0081b5",
        400: "#00adf1",
        500: "#30c5ff",
        600: "#58d0ff",
        700: "#82dbff",
        800: "#abe7ff",
        900: "#d5f3ff",
      },
      ivory: {
        DEFAULT: "#f5f3e5",
        100: "#443f1b",
        200: "#897d35",
        300: "#c0b35d",
        400: "#dad3a1",
        500: "#f5f3e5",
        600: "#f7f5ea",
        700: "#f9f8f0",
        800: "#fbfaf5",
        900: "#fdfdfa",
      },
      rich_black: {
        DEFAULT: "#04131b",
        100: "#010405",
        200: "#02070b",
        300: "#020b10",
        400: "#030f15",
        500: "#04131b",
        600: "#104d6e",
        700: "#1d88c1",
        800: "#58b4e6",
        900: "#acdaf3",
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
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
