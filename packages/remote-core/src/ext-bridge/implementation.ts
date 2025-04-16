import { RemoteError } from "@/error";
import type { ExtBridgeConnectionApi } from "@mittwald/ext-bridge";

export const emptyImplementation = new Proxy(
  {},
  {
    get() {
      throw new RemoteError("Missing implementation for mittwald.extBridge");
    },
  },
) as ExtBridgeConnectionApi;
