import type { RemoteExtBridgeConnectionApi } from "@/connection/types";
import { RemoteError } from "@/error";

export const emptyImplementation: RemoteExtBridgeConnectionApi = {
  getConfig: async () => ({
    sessionId: "",
    userId: "",
    extensionId: "",
    extensionInstanceId: "",
  }),
  getSessionToken: async () => {
    throw new RemoteError("Missing implementation for mittwald.extBridge");
  },
};
