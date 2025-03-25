import { parseConfig } from "@/config/parse";
import { ExtBridgeError } from "@/error";

let resolveReadyPromise: () => void = () => {
  throw new ExtBridgeError("Unexpected call of resolveReadyPromise()");
};

export const loadingApi = {
  ready: new Promise<void>((res) => {
    resolveReadyPromise = res;
  }),
  setIsReady: async () => {
    const config = await mittwald.extBridge.getConfig();
    mittwald.extBridge.config = parseConfig(config);
    resolveReadyPromise();
  },
} as const;
