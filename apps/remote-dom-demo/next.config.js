/** @type {import("next").NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_BASE_PATH ?? "",
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  /*
   * The Svelte remote app under `/remote-svelte` is compiled by svelte-loader.
   * Two rules, because Svelte has two source kinds: components, and `.svelte.js`
   * modules holding runes (`svelte.compileModule`) — the package's contexts and
   * controllers are the latter.
   *
   * No preprocessor is configured, so nothing here may use `lang="ts"`:
   * `svelte-package` has already transpiled the package's own components, and
   * the demos below are plain JavaScript. A preprocessor is a function, and a
   * Turbopack rule's options have to be serializable.
   */
  turbopack: {
    rules: {
      /*
       * `as: "*.mjs"` on both, not `"*.js"`: the rule's output keeps the glob's
       * capture, so a component compiled `as: "*.js"` lands on `X.svelte.js` —
       * which matches the second rule and is compiled again, this time as a
       * rune module. The error that comes back is `dollar_binding_invalid` on
       * the compiler's own output.
       */
      "*.svelte": {
        loaders: ["svelte-loader"],
        as: "*.mjs",
      },
      "*.svelte.js": {
        loaders: ["svelte-loader"],
        as: "*.mjs",
      },
    },
  },
  experimental: {
    useTypeScriptCli: true,
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
