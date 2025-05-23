import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["prettier", "next", "next/core-web-vitals", "next/typescript"],
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "typescript-eslint/no-unused-vars": "warn",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      "@typescript-eslint/no-unsafe-declaration-merging": "warn",
      "react-hooks/rules-of-hooks": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "jsx-a11y/img-redundant-alt": "warn",
    },
  }),
];

export default eslintConfig;
