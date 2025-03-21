import { usePromise } from "@mittwald/react-use-promise";

export const useExtBridge = () =>
  usePromise(async () => {
    await globalThis.mwExtBridge.ready;
    return globalThis.mwExtBridge;
  }, []);
