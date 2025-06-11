/** @type {import("next").NextConfig} */
const nextConfig = {
  devIndicators: false,
  basePath: process.env.NEXT_BASE_PATH ?? "",
  pageExtensions: ["js", "jsx", "ts", "tsx"],
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
