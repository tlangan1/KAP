import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    // Apply rules to TS/TSX files
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      // TanStack Query lint rules
      pluginQuery.configs["flat/recommended"],
      // or the stricter ruleset
      // pluginQuery.configs["flat/strict"],
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
]);
