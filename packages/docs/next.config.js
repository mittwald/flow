import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx", "example"],
  webpack: (config, _) => {
    config.module.rules.push({
      test: /_examples\/.*$/i,
      use: "raw-loader",
    });

    return config;
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
