import { getExtBridge } from "@/getExtBridge";

export const getSessionToken = async () => {
  const bridge = await getExtBridge();
  return bridge.connection.getSessionToken();
};
