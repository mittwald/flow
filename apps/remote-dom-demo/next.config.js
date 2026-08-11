/** @type {import("next").NextConfig} */
const nextConfig = {
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
