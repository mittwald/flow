import { defineConfig } from "oxlint";

const designTokensJsonImport = {
  group: ["@mittwald/flow-design-tokens/json/*"],
  message:
    "Import @mittwald/flow-design-tokens/json-runtime/* instead. The json build carries style-dictionary metadata (filePath, isSource, original, attributes) on every token, which dwarfs the values and lands in the bundle as dead weight. json-runtime holds the same values with only `value` and `path`. Need `original` for build-time tooling? Read json outside src/.",
};

export default defineConfig({
  plugins: ["eslint", "typescript", "react"],
  jsPlugins: ["./packages/components/dev/oxlint/flowPlugin.mjs"],
  categories: {
    correctness: "off",
  },
  env: {
    builtin: true,
  },
  ignorePatterns: [
    "**/dist",
    "**/out",
    "**/.next",
    "**/next.config.js",
    "**/next-env.d.ts",
    "**/*.cjs",
    ".nx",
    "**/.vitest",
    "**/.source",
    ".claude/worktrees/**",
  ],
  rules: {
    // eslint:recommended
    "constructor-super": "error",
    "for-direction": "error",
    "getter-return": "error",
    "no-async-promise-executor": "error",
    "no-case-declarations": "error",
    "no-class-assign": "error",
    "no-compare-neg-zero": "error",
    "no-cond-assign": "error",
    "no-const-assign": "error",
    "no-constant-binary-expression": "error",
    "no-constant-condition": "error",
    "no-control-regex": "error",
    "no-debugger": "error",
    "no-delete-var": "error",
    "no-dupe-class-members": "error",
    "no-dupe-else-if": "error",
    "no-dupe-keys": "error",
    "no-duplicate-case": "error",
    "no-empty": "error",
    "no-empty-character-class": "error",
    "no-empty-pattern": "error",
    "no-empty-static-block": "error",
    "no-ex-assign": "error",
    "no-extra-boolean-cast": "error",
    "no-fallthrough": "error",
    "no-func-assign": "error",
    "no-global-assign": "error",
    "no-import-assign": "error",
    "no-invalid-regexp": "error",
    "no-irregular-whitespace": "error",
    "no-loss-of-precision": "error",
    "no-misleading-character-class": "error",
    "no-new-native-nonconstructor": "error",
    "no-nonoctal-decimal-escape": "error",
    "no-obj-calls": "error",
    "no-prototype-builtins": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-self-assign": "error",
    "no-setter-return": "error",
    "no-shadow-restricted-names": "error",
    "no-sparse-arrays": "error",
    "no-this-before-super": "error",
    "no-unassigned-vars": "error",
    "no-unreachable": "error",
    "no-unsafe-finally": "error",
    "no-unsafe-negation": "error",
    "no-unsafe-optional-chaining": "error",
    "no-unused-labels": "error",
    "no-unused-private-class-members": "error",
    "no-useless-backreference": "error",
    "no-useless-catch": "error",
    "no-useless-escape": "error",
    "no-useless-assignment": "error",
    "no-with": "error",
    "preserve-caught-error": "error",
    "require-yield": "error",
    "use-isnan": "error",
    "valid-typeof": "error",

    // typescript-eslint recommended + stylistic
    "no-array-constructor": "error",
    "no-unused-expressions": "error",
    "no-empty-function": "error",
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "[iI]gnored",
        argsIgnorePattern: "[iI]gnored",
        caughtErrorsIgnorePattern: "[iI]gnored",
      },
    ],
    "typescript/ban-ts-comment": "error",
    "typescript/no-duplicate-enum-values": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-explicit-any": "error",
    "typescript/no-extra-non-null-assertion": "error",
    "typescript/no-misused-new": "error",
    "typescript/no-namespace": "error",
    "typescript/no-non-null-asserted-optional-chain": "error",
    "typescript/no-require-imports": "error",
    "typescript/no-this-alias": "error",
    "typescript/no-unnecessary-type-constraint": "error",
    "typescript/no-unsafe-declaration-merging": "error",
    "typescript/no-unsafe-function-type": "error",
    "typescript/no-wrapper-object-types": "error",
    "typescript/prefer-as-const": "error",
    "typescript/prefer-namespace-keyword": "error",
    "typescript/triple-slash-reference": "error",
    "typescript/adjacent-overload-signatures": "error",
    "typescript/array-type": "error",
    "typescript/ban-tslint-comment": "error",
    "typescript/class-literal-property-style": "error",
    "typescript/consistent-generic-constructors": "error",
    "typescript/consistent-indexed-object-style": "error",
    "typescript/consistent-type-assertions": "error",
    "typescript/consistent-type-definitions": "error",
    "typescript/no-confusing-non-null-assertion": "error",
    "typescript/no-inferrable-types": "error",
    "typescript/prefer-for-of": "error",
    "typescript/prefer-function-type": "error",

    // Repeatedly flagged by hand in review, so let the linter catch it.
    "react/jsx-key": "error",
    // Dependency arrays are a frequent source of subtle bugs, surfaced as
    // warnings. (rules-of-hooks is intentionally NOT enabled: Flow models
    // custom hooks as class static methods, e.g. ActionModel.useNew, which
    // the rule cannot recognize and would flag en masse as false positives.)
    "react/exhaustive-deps": "warn",
    // Non-null assertions hide real null/undefined cases; throw with a
    // meaningful error (e.g. tiny-invariant) instead of asserting with "!".
    "typescript/no-non-null-assertion": "error",
    "typescript/consistent-type-imports": [
      "error",
      { fixStyle: "separate-type-imports" },
    ],
  },
  overrides: [
    {
      // TypeScript reports undefined names in TS files itself.
      files: ["**/*.js", "**/*.mjs", "**/*.jsx"],
      rules: {
        "no-undef": "error",
      },
    },
    {
      // TypeScript itself reports what these rules check.
      files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
      rules: {
        "constructor-super": "off",
        "getter-return": "off",
        "no-class-assign": "off",
        "no-const-assign": "off",
        "no-dupe-class-members": "off",
        "no-dupe-keys": "off",
        "no-func-assign": "off",
        "no-import-assign": "off",
        "no-new-native-nonconstructor": "off",
        "no-obj-calls": "off",
        "no-redeclare": "off",
        "no-setter-return": "off",
        "no-this-before-super": "off",
        "no-unreachable": "off",
        "no-unsafe-negation": "off",
        "no-with": "off",
        "no-var": "error",
        "prefer-const": "error",
        "prefer-rest-params": "error",
        "prefer-spread": "error",
      },
    },
    {
      files: [
        "**/src/auto-generated/**",
        "**/src/views/**",
        "**/components/**/view.ts",
        "**/Icon/components/icons/**",
      ],
      rules: {
        "typescript/no-non-null-assertion": "off",
      },
    },
    {
      // Anything under src/ can end up in a browser bundle.
      files: ["**/src/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          { patterns: [designTokensJsonImport] },
        ],
      },
    },
    {
      /*
       * Compiled by the React and the Vue binding alike, so neither framework
       * may enter — nor the `@/` alias, which would resolve against whichever
       * package is building it. Repeats the pattern above: a later override
       * replaces a rule's options instead of merging them.
       */
      files: ["packages/components-base/**"],
      rules: {
        "no-restricted-imports": [
          "error",
          {
            patterns: [
              designTokensJsonImport,
              {
                group: [
                  "react",
                  "react/*",
                  "react-dom",
                  "react-dom/*",
                  "vue",
                  "vue/*",
                  "@vue/*",
                  "@mittwald/flow-react-components",
                  "@mittwald/flow-react-components/*",
                  "@mittwald/react-use-promise",
                ],
                message:
                  "components-base is framework-free: the React and the Vue binding both run it. Keep the framework in the binding and hand the shared model what it needs.",
              },
              {
                group: ["@/*"],
                message:
                  "Use a relative import. components-base is compiled by two packages, and `@/` resolves against whichever one is building it.",
              },
            ],
          },
        ],
      },
    },
    {
      // An unknown `flow--…` name fails silently: a `className` styles nothing,
      // a `querySelector` finds nothing.
      files: ["**/src/**/*.{js,jsx,mjs,ts,tsx}"],
      rules: {
        "flow/no-unknown-flow-class": "error",
      },
    },
    {
      files: [
        // Codemods name removed classes on purpose.
        "packages/codemods/**",
        // Stubs echo their `:global()` targets; stylelint checks those.
        "**/*.module.d.*.ts",
      ],
      rules: {
        "flow/no-unknown-flow-class": "off",
      },
    },
    {
      // ADR 0008: code reads Semantic or Variant colors, never Brand. Brand is
      // theme-neutral, so a Brand variable stays light in dark. The groups come
      // from design-tokens/src/color-brand.yml, so a new one is covered.
      files: [
        "packages/components/**/*.{js,jsx,mjs,ts,tsx}",
        "apps/docs/**/*.{js,jsx,mjs,ts,tsx}",
      ],
      rules: {
        "flow/no-brand-color-variable": "error",
      },
    },
    {
      files: [
        // Lint tooling, which names Brand variables to reject them.
        "packages/components/dev/**",
        // Docs pages that display the palette itself: the Brand value is the
        // content. Keep in sync with stylelint.config.mjs.
        "apps/docs/src/content/foundations/design/colors/**",
        "apps/docs/src/content/foundations/design/design-tokens/**",
      ],
      rules: {
        "flow/no-brand-color-variable": "off",
      },
    },
    {
      /*
       * The Vue demos' JSX namespace (`_lib/jsx-runtime.ts`) has to be a
       * namespace — the one shape TypeScript accepts for `@jsxImportSource` —
       * and mirrors Vue's own, empty interfaces and index signature included.
       */
      files: ["apps/remote-dom-demo/src/app/remote-vue/_lib/jsx-*runtime.ts"],
      rules: {
        "typescript/no-namespace": "off",
        "typescript/no-empty-object-type": "off",
        "typescript/consistent-indexed-object-style": "off",
      },
    },
    {
      /*
       * Vue demos that hand a slot a static array of children
       * (`default: () => [<A />, <B />]`), the Vue JSX idiom for a slot with
       * several children. Vue matches those by position, so a key there says
       * nothing. `react/jsx-key` has no option to tell such an array from an
       * iterator's output, which Vue does need keyed — so it is off per file,
       * and every other Vue demo keeps the check on `.map()` and `Array.from`.
       */
      files: [
        "apps/remote-dom-demo/src/app/remote-vue/_demos/navigation.tsx",
        "apps/remote-dom-demo/src/app/remote-vue/_demos/tunnel.tsx",
      ],
      rules: {
        "react/jsx-key": "off",
      },
    },
    {
      // Node ES-module CLI scripts (not bundled).
      files: [".github/scripts/**/*.mjs", "packages/design-tokens/dev/**/*.js"],
      env: { node: true },
    },
  ],
});
