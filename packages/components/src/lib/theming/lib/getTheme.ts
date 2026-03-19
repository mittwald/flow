import type { ResolvedTheme } from "../types";
import { getStoredTheme } from "./getStoredTheme";
import { resolveTheme } from "./resolveTheme";

export const getTheme = (): ResolvedTheme => {
  return resolveTheme(getStoredTheme());
};
