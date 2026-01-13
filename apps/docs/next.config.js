import { createMDX } from "fumadocs-mdx/next";

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
};

const withMDX = createMDX();

export default withMDX(nextConfig);
