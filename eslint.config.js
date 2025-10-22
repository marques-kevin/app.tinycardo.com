import js from "@eslint/js"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import globals from "globals"
import tseslint from "typescript-eslint"

export default tseslint.config(
  { ignores: ["dist", "storybook-static"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-hooks/rules-of-hooks": "off",
      "no-console": ["error", { allow: ["info", "warn", "error"] }],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unexpected-multiline": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "no-empty": "warn",
      "react-hooks/exhaustive-deps": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "no-restricted-exports": [
        "error",
        {
          restrictDefaultExports: { direct: true },
        },
      ],
    },
  },
  {
    files: [
      "*.test.ts",
      "**/scripts/*.ts",
      "**/*.stories.{ts,tsx}",
      ".storybook/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": "off",
      "no-restricted-exports": "off",
    },
  },
)
