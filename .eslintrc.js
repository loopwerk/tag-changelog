module.exports = {
  extends: ["eslint:recommended"],
  plugins: ["prettier"],
  env: {
    es6: true,
    browser: false,
    node: true,
    commonjs: true,
  },
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: "module",
  },
  rules: {
    "prettier/prettier": ["error", { printWidth: 200 }],
    "prefer-const": "error",
    eqeqeq: "error",
    "no-useless-return": "error",
  },
};
