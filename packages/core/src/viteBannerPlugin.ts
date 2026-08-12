import type { Plugin } from "vite";

export function viteBannerPlugin(
  getBanner: (filename: string) => string,
): Plugin {
  return {
    name: "vite-banner",
    apply: "build",
    generateBundle(outputOptions, bundle) {
      for (const [fileName, asset] of Object.entries(bundle)) {
        if (asset.type === "asset") continue;

        const bannerContent = getBanner(fileName);

        if (bannerContent) {
          asset.code = `${bannerContent}\n${asset.code}`;
        }
      }
    },
  };
}
