import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";

export const emptyImplementation = new Proxy(
  {},
  {
    get() {
      throw new Error("Missing implementation for MwExtBridge");
    },
  },
) as ExtBridgeRemoteApi;
