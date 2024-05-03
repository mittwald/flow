import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  basePath: process.env.NEXT_BASE_PATH ?? "",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx", "example"],
  webpack: (config, _) => {
    config.module.rules.push({
      test: /_examples\/.*$/i,
      use: "raw-loader",
    });

    return config;
  },
  transpilePackages: ["next-mdx-remote"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
});

export default withMDX(nextConfig);
