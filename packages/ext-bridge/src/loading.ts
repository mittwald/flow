import { parseConfig } from "@/config/parse";

let resolveReadyPromise: () => void = () => {
  throw new Error("Unexpected call of resolveReadyPromise()");
};

export const loadingApi = {
  ready: new Promise<void>((res) => {
    resolveReadyPromise = res;
  }),
  setIsReady: async () => {
    const config = await mwExtBridge.getConfig();
    mwExtBridge.config = parseConfig(config);
    resolveReadyPromise();
  },
} as const;
