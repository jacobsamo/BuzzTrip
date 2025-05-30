/** @type {import("prettier").Config} */
module.exports = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  printWidth: 80,
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-organize-imports"],
};
