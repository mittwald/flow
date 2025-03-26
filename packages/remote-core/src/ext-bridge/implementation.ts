import { RemoteError } from "@/error";
import type { ExtBridgeRemoteApi } from "@mittwald/ext-bridge";

const throwIt = async () => {
  throw new RemoteError("Missing implementation for mittwald.extBridge");
};

export const emptyImplementation: ExtBridgeRemoteApi = {
  getSessionToken: throwIt,
  getConfig: throwIt,
};
