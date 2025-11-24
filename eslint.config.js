import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "app",
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
    ignores: [".github"],
  },
  {
    rules: {
      "no-unused-vars": ["off"],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "node/no-process-env": ["error"],
      "perfectionist/sort-imports": ["error", {
        tsconfigRootDir: ".",
      }],
    },
  },
);
