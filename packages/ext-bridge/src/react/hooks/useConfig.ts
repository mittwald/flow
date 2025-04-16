import { useExtBridge } from "@/react/hooks/useExtBridge";

export const useConfig = () => {
  return useExtBridge().config;
};
