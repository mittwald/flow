import { parseConfig } from "@/config/parse";
import { debug } from "@/debug";
import { ExtBridgeError } from "@/error";

let resolveReadyPromise: () => void = () => {
  throw new ExtBridgeError("Unexpected call of resolveReadyPromise()");
};

export const loadingApi = {
  ready: new Promise<void>((res) => {
    resolveReadyPromise = res;
  }),
  setIsReady: async () => {
    debug("setting ExtBridge to ready and getting config");
    const config = await mittwald.extBridge.getConfig();
    mittwald.extBridge.config = parseConfig(config);
    resolveReadyPromise();
  },
} as const;
