import { type ObservableMap } from "mobx";

export const mobxMapToObject = <T>(
  map: ObservableMap<string, T>,
): Record<string, T> => Object.fromEntries(map.entries());
