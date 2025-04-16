export const getExtBridge = async () => {
  await globalThis.mwExtBridge.readiness.isReady();
  return globalThis.mwExtBridge;
};
