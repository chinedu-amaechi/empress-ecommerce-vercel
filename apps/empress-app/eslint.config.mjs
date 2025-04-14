import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "react/display-name": "off", // Turn off this rule
      "react/no-unescaped-entities": "off", // Turn off this rule
      "react-hooks/exhaustive-deps": "warn", // Turn on this rule with a warning level
      "@next/next/no-img-element": "warn", // Turn on this rule with a warning level
      "react/jsx-no-duplicate-props": "error", // Turn on this rule with an error level
    },
  },
];

export default eslintConfig;
