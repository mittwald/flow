import { usePromise } from "@mittwald/react-use-promise";

export const useExtBridge = () =>
  usePromise(async () => {
    await globalThis.mittwald.extBridge.ready;
    return globalThis.mittwald.extBridge;
  }, []);
