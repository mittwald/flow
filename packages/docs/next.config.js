import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx", "example"],
  webpack: (config, _) => {
    config.module.rules.push({
      test: /_examples\/.*$/i,
      use: "raw-loader",
    });

    return config;
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
});

export default withMDX(nextConfig);
