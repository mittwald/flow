import lightTokens from "@mittwald/flow-design-tokens/json-runtime/all-light.json";
import darkTokens from "@mittwald/flow-design-tokens/json-runtime/all-dark.json";
import { useResolvedTheme } from "./useResolvedTheme";

export const useDesignTokens = () => {
  const theme = useResolvedTheme();
  return theme === "light" ? lightTokens : darkTokens;
};
