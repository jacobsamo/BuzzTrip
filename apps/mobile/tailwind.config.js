
/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset"), require("@buzztrip/tailwind-config")],
  theme: {
    extend: {},
  },
  plugins: [],
}