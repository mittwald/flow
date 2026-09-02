import eslint from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  {
    ignores: [
      "**/dist",
      "**/out",
      "**/.next",
      "**/next.config.js",
      "**/next-env.d.ts",
      "**/*.cjs",
      ".next/**/*",
      ".nx",
      "**/.vitest",
      "**/.source",
      ".claude/worktrees/**",
    ],
  },
  {
    plugins: {
      "unused-imports": unusedImports,
      react,
      "react-hooks": reactHooks,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      parserOptions: {
        // Automatic JSX runtime (tsconfig jsx: "react-jsx"): JSX does NOT
        // require a React import, so React must not be treated as "used".
        jsxPragma: null,
      },
    },
    rules: {
      // Enforce keys on list-rendered elements (the plugin is otherwise
      // unused; only this rule is enabled). Repeatedly flagged by hand in
      // review, so let the linter catch it.
      "react/jsx-key": "error",
      // Dependency arrays are a frequent source of subtle bugs, surfaced as
      // warnings. (rules-of-hooks is intentionally NOT enabled: Flow models
      // custom hooks as class static methods, e.g. ActionModel.useNew, which
      // the rule cannot recognize and would flag en masse as false positives.)
      "react-hooks/exhaustive-deps": "warn",
      // Non-null assertions hide real null/undefined cases; throw with a
      // meaningful error (e.g. tiny-invariant) instead of asserting with "!".
      "@typescript-eslint/no-non-null-assertion": "error",
      "linebreak-style": ["error", "unix"],
      quotes: [
        "error",
        "double",
        {
          avoidEscape: true,
        },
      ],
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "[iI]gnored",
          argsIgnorePattern: "[iI]gnored",
          caughtErrorsIgnorePattern: "[iI]gnored",
        },
      ],
      // Auto-removable unused imports (e.g. the now-unnecessary default React
      // import under the automatic JSX runtime).
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "separate-type-imports",
        },
      ],
    },
  },
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    files: [
      "**/src/auto-generated/**",
      "**/src/views/**",
      "**/components/**/view.ts",
      "**/Icon/components/icons/**",
    ],
    languageOptions: {
      parserOptions: {
        jsxPragma: "React",
      },
    },
    rules: {
      "unused-imports/no-unused-imports": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    // Anything under src/ can end up in a browser bundle.
    files: ["**/src/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@mittwald/flow-design-tokens/json/*"],
              message:
                "Import @mittwald/flow-design-tokens/json-runtime/* instead. The json build carries style-dictionary metadata (filePath, isSource, original, attributes) on every token, which dwarfs the values and lands in the bundle as dead weight. json-runtime holds the same values with only `value` and `path`. Need `original` for build-time tooling? Read json outside src/.",
            },
          ],
        },
      ],
    },
  },
  {
    // Node ES-module CLI scripts (run by GitHub Actions, not bundled).
    files: [".github/scripts/**/*.mjs"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
      },
    },
  },
);
