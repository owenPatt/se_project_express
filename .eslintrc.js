module.exports = {
  extends: ["airbnb-base", "prettier"],
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
  },
};

// env: {
//   browser: true,
//   commonjs: true,
//   es2021: true,
// },
// overrides: [
//   {
//     env: {
//       node: true,
//     },
//     files: [".eslintrc.{js,cjs}"],
//     parserOptions: {
//       sourceType: "script",
//     },
//   },
// ],
// parserOptions: {
//   ecmaVersion: "latest",
// },
