import type { ResolvedTheme } from "../types";
import { getTheme } from "./getTheme";
import { resolveTheme } from "./resolveTheme";

export const getResolvedTheme = (): ResolvedTheme => {
  return resolveTheme(getTheme());
};
