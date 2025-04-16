import { getExtBridge } from "@/getExtBridge";

export const getConfig = async () => {
  const extBridge = await getExtBridge();
  return extBridge.config;
};
