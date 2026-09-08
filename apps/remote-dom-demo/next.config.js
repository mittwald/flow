/** @type {import("next").NextConfig} */
const nextConfig = {
  /*
   * `next dev` otherwise appends its managed agent-rules block to this app's
   * AGENTS.md on every start. It writes the paragraphs unwrapped, prettier
   * rewraps them at 80 columns, and the two overwrite each other forever — so
   * every dev run leaves a dirty tree, and committing the block instead breaks
   * `format:check` on push. Our AGENTS.md files are hand-written; the Next 16
   * pointer the block carried is now a line in this app's AGENTS.md.
   */
  agentRules: false,
  basePath: process.env.NEXT_BASE_PATH ?? "",
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  experimental: {
    useTypeScriptCli: true,
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
