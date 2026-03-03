import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(js.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended, {
  files: ["src/**/*.ts", "test/**/*.ts"],
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    globals: {
      ...globals.node,
    },
  },
  rules: {
    "no-var": "error",
    "prefer-const": "error",
    eqeqeq: "error",
    "no-useless-return": "error",
  },
});
