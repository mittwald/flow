/**
 * The `unplugin-dts` options every package's release build shares.
 *
 * `include: ["src"]` alone emits declarations for ALL of `src` — stories and
 * tests with it. Those are dead files: no `exports` path reaches them, nothing
 * imports them, and they made up 196 of the 799 entries in
 * `@mittwald/flow-remote-react-components@1.1.10` (#3023). `exclude` keeps them
 * out, which also lets the release-relevance guard skip a test-only change
 * honestly instead of arguing about tarball membership
 * (`.github/scripts/release-relevance-lib.mjs`).
 *
 * The globs match story and test FILES, not the directories around them. A
 * helper beside a story stays: `dev/createDocPropertiesJson.ts` parses every
 * `.tsx` under `src/` and ignores only `*.stories.tsx`, so
 * `components/Button/stories/lib.tsx` really does contribute to the published
 * `dist/assets/doc-properties.json` — five of its entries. Keep this list and
 * the guard's denylist in step; they answer the same question.
 *
 * The globs cannot move into the shared tsconfig preset instead: its `exclude`
 * governs `tsc --noEmit` too, and dropping tests from `test:compile` would stop
 * type-checking the largest surface in the repository.
 *
 * `exclude` REPLACES the tsconfig's own list rather than extending it, so
 * `node_modules` and `dist` are repeated here.
 */
export const publishedDtsOptions = {
  include: ["src"],
  exclude: [
    "node_modules/**",
    "dist/**",
    "**/tests/**",
    "**/e2e/**",
    "**/*.stories.*",
    "**/*.test.*",
  ],
  outDirs: "dist/types",
};
