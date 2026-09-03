import { initExtBridge } from "@/global-browser";

export const getExtBridge = async () => {
  initExtBridge();
  await globalThis.mwExtBridge.readiness.isReady();
  return globalThis.mwExtBridge;
};
