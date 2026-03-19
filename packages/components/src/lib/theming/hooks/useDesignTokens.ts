import light from "@mittwald/flow-design-tokens/json/all-light.json";
import dark from "@mittwald/flow-design-tokens/json/all-dark.json";
import { useTheme } from "./useTheme";

export const useDesignTokens = () => {
  const theme = useTheme();
  return theme === "dark" ? dark : light;
};
