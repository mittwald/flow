import { getExtBridge } from "@/getExtBridge";
import { usePromise } from "@mittwald/react-use-promise";

export const useExtBridge = () => {
  return usePromise(getExtBridge, []);
};
