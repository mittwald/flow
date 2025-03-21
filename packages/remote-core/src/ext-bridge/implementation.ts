import { RemoteError } from "@/error";
import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";

export const emptyImplementation = new Proxy(
  {},
  {
    get() {
      throw new RemoteError("Missing implementation for MwExtBridge");
    },
  },
) as ExtBridgeRemoteApi;
