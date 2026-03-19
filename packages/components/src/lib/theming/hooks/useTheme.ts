import type { ResolvedTheme } from "../types";
import { useSystemTheme } from "./useSystemTheme";
import { useStoredTheme } from "./useStoredTheme";

export const useTheme = (): ResolvedTheme => {
  const storedTheme = useStoredTheme();
  const systemTheme = useSystemTheme();
  return storedTheme === "system" ? systemTheme : storedTheme;
};
