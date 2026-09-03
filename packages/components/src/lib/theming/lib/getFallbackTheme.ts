import type { Theme } from "../types";
import { isClientSide } from "./isClientSide";

export const getFallbackTheme = (): Theme => {
  return isClientSide() ? "system" : "light";
};
