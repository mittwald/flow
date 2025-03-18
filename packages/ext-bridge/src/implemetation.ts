import type { ExtBridgeFunctions } from "./types";

export const emptyImplementation = new Proxy(
  {},
  {
    get() {
      throw new Error("Missing implementation for MwExtBridge");
    },
  },
) as ExtBridgeFunctions;
