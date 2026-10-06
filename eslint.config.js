import eslint from "@eslint/js";
import unusedImports from "eslint-plugin-unused-imports";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import flow from "./packages/components/dev/eslint/index.mjs";

/**
 * React 19 passes `ref` as an ordinary prop, and every Flow component takes it
 * that way (`FlowComponentProps<RefElement>`). A `forwardRef` wrapper adds an
 * extra component layer that `flowComponent`'s memoization and the remote
 * serialization both have to see through.
 */
const forwardRefPath = {
  name: "react",
  importNames: ["forwardRef"],
  message:
    "Take `ref` as a normal prop instead (React 19). Flow components get it from `FlowComponentProps<RefElement>`.",
};

const designTokensJsonPattern = {
  group: ["@mittwald/flow-design-tokens/json/*"],
  message:
    "Import @mittwald/flow-design-tokens/json-runtime/* instead. The json build carries style-dictionary metadata (filePath, isSource, original, attributes) on every token, which dwarfs the values and lands in the bundle as dead weight. json-runtime holds the same values with only `value` and `path`. Need `original` for build-time tooling? Read json outside src/.",
};

/**
 * `stories/lib.tsx` holds fixtures that exist to make a story readable — demo
 * data, throwaway wrappers. Importing one from component code makes it ship to
 * consumers and ties the component's behavior to a fixture nobody maintains as
 * production code.
 */
const storiesLibPattern = {
  group: ["**/stories/lib", "**/stories/lib.tsx", "**/stories/lib.js"],
  message:
    "stories/lib.tsx holds story-only fixtures. Move what the component needs into the component (or src/lib/) instead of importing a fixture from production code.",
};

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
      flow,
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
    // `no-restricted-imports` options replace rather than merge, so every block
    // that sets it repeats the entries that still apply there.
    rules: {
      "no-restricted-imports": ["error", { paths: [forwardRefPath] }],
    },
  },
  {
    // Anything under src/ can end up in a browser bundle.
    files: ["**/src/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [forwardRefPath],
          patterns: [designTokensJsonPattern, storiesLibPattern],
        },
      ],
    },
  },
  {
    // Stories are where story fixtures belong.
    files: ["**/*.stories.tsx", "**/stories/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        { paths: [forwardRefPath], patterns: [designTokensJsonPattern] },
      ],
    },
  },
  {
    files: ["packages/components/src/**/*.tsx"],
    ignores: ["**/*.test.tsx", "**/*.test-types.tsx", "**/stories/**"],
    rules: {
      "flow/flow-component-name": "error",
    },
  },
  {
    files: ["packages/components/src/**/*.{ts,tsx}"],
    ignores: [
      "**/src/views/**",
      "**/components/**/view.ts",
      "**/*.test.{ts,tsx}",
    ],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          // `styles` is precisely typed by the generated *.module.d.scss.ts
          // stub, so the cast asserts a class exists instead of checking it —
          // and a renamed or removed class then resolves to `undefined` at
          // runtime with no type error. The helper returns `string | undefined`
          // and makes that case visible.
          selector:
            'TSAsExpression > TSTypeOperator[operator="keyof"] > TSTypeQuery > Identifier[name="styles"]',
          message:
            "Don't cast to `keyof typeof styles` — it hides a missing class. Index `styles` with a narrow union, or use `styleClassname(styles, key)` from @/lib/scss/selectors for a string-typed key.",
        },
      ],
    },
  },
  {
    /*
     * Vite's native (Node) config loader resolves neither extensionless
     * relative imports nor a directory's package.json `main`, and needs an
     * import attribute on JSON. Everything a config imports transitively is
     * subject to the same rules — hence `dev/vite`, `dev/vitest` and
     * `packages/core/src` alongside the config files themselves. Their tests
     * are not: vitest loads those, not the config loader.
     */
    files: [
      "**/vite*.config.ts",
      "**/vitest*.config.ts",
      "**/dev/vite/**/*.ts",
      "**/dev/vitest/**/*.ts",
      "packages/core/src/**/*.ts",
    ],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "ImportDeclaration[source.value=/^\\.{1,2}\\/(?!.*\\.(ts|tsx|mts|cts|js|mjs|cjs|json|css|scss)$).*/]",
          message:
            "Spell the extension out (./foo.ts, ../core/src/index.ts). Vite's native config loader resolves neither extensionless imports nor a directory's package.json `main`. Add `allowImportingTsExtensions` to the package's tsconfig.vite.json if tsc complains.",
        },
        {
          selector:
            "ImportDeclaration[source.value=/\\.json$/][attributes.length=0]",
          message:
            'Import JSON with an attribute: `import pkg from "./package.json" with { type: "json" }`. Vite\'s native config loader requires it.',
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
