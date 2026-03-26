import type { GetSettingsMiddleware, SetSettingsMiddleware } from "./types";

export const defaultGetMiddleware: GetSettingsMiddleware = (
  _,
  __,
  current,
  getParent,
) => current ?? getParent();

export const defaultSetMiddleware: SetSettingsMiddleware = (
  _,
  __,
  settings,
) => {
  return settings;
};
