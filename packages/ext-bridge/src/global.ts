import { loadingApi } from "@/loading";
import type { ExtBridge } from "@/types";

const isAlreadyDefined = typeof globalThis.mwExtBridge !== "undefined";

if (isAlreadyDefined) {
  console.warn(
    "mwExtBridge is already defined. The @mittwald/ext-bridge package is probably installed multiple times.",
  );
}

globalThis.mwExtBridge = {
  ...loadingApi,
} as ExtBridge;
