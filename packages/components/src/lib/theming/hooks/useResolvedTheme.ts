import type { ResolvedTheme } from "../types";
import { useSystemTheme } from "./useSystemTheme";
import { useTheme } from "./useTheme";

export const useResolvedTheme = (): ResolvedTheme => {
  const theme = useTheme();
  const systemTheme = useSystemTheme();
  return theme === "system" ? systemTheme : theme;
};
