import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/coverage/**",
      "**/node_modules/**",
      "**/*.d.ts",
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts", "**/*.tsx"],

    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },

    rules: {
      "no-unused-vars": "off",

      "no-console": "warn",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-namespace": "off",
    },
  },

  {
    files: ["apps/example-express/**/*.ts"],

    rules: {
      "no-console": "off",
    },
  },

  {
    files: ["packages/express/src/middleware/**/*.ts"],

    rules: {
      "no-console": "off",
    },
  },

  eslintConfigPrettier,
];
