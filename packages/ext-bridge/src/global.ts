import { loadingApi } from "@/loading";
import type { ExtBridge } from "@/types";

const isAlreadyDefined = typeof globalThis.mittwald?.extBridge !== "undefined";

if (isAlreadyDefined) {
  console.warn(
    "mittwald.extBridge is already defined. The @mittwald/ext-bridge package is probably installed multiple times.",
  );
}

const extBridge = {
  ...loadingApi,
} as ExtBridge;

if (typeof globalThis.mittwald === "undefined") {
  globalThis.mittwald = {
    extBridge,
  };
} else {
  globalThis.mittwald.extBridge = extBridge;
}
