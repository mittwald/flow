import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkGfm from "remark-gfm"; // Tables, footnotes, strikethrough, task lists, literal URLs.

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  transpilePackages: ["next-mdx-remote"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
  },
});

export default withMDX(nextConfig);
