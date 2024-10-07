import { type ObservableMap, toJS } from "mobx";

export const mobxMapToObject = (map: ObservableMap) =>
  Object.fromEntries(toJS(map).entries());
