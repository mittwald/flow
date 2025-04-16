import { readinessApi } from "@/readiness";
import type { ExtBridge } from "@/types";

const isAlreadyDefined = typeof globalThis.mwExtBridge !== "undefined";

if (isAlreadyDefined) {
  console.warn(
    "mwExtBridge is already defined. The @mittwald/ext-bridge package is probably installed multiple times.",
  );
}

export const mwExtBridge = {
  readiness: readinessApi,
} as ExtBridge;

globalThis.mwExtBridge = mwExtBridge;
