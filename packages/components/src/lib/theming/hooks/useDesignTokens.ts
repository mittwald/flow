import lightTokens from "@mittwald/flow-design-tokens/json/all-light.json";
import darkTokens from "@mittwald/flow-design-tokens/json/all-dark.json";
import { useResolvedTheme } from "./useResolvedTheme";

export const useDesignTokens = () => {
  const theme = useResolvedTheme();
  return theme === "light" ? lightTokens : darkTokens;
};
