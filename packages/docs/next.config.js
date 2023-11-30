import createMDX from "@next/mdx";
import generateImportMappings from "./scripts/out/generateImports.js";

// Waiting for https://github.com/FormidableLabs/react-live/issues/339
const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx", "example"],
  webpack: (config, options) => {
    config.module.rules.push({
      test: /_examples\/.*$/i,
      use: "raw-loader",
    });

    generateImportMappings();

    return config;
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
