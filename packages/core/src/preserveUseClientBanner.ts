import type { AddonFunction } from "rolldown";
export const preserveUseClientBanner: AddonFunction = (chunk) => {
  return chunk.fileName.endsWith(".mjs") &&
    !chunk.fileName.endsWith("index.mjs")
    ? '"use client"\r\n/* */'
    : "";
};
