import { createMDX } from "fumadocs-mdx/next";

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
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
  experimental: {
    useTypeScriptCli: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_BASE_PATH ?? "",
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
