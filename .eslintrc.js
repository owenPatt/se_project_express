module.exports = {
  extends: ["airbnb-base", "prettier"],
  rules: {
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-console": ["error", { allow: ["log", "error"] }],
  },
};
