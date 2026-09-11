import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Reference material, not source. docs/bottle-scene-reference.js is a
      // standalone Three.js scene that assumes globals supplied by its viewer,
      // so linting it as project source reports undefined names that are
      // correct in the context it actually runs in.
      "docs/**",
    ],
  },
];

export default eslintConfig;
