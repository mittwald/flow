import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentBaseNameOf } from "./remoteComponentBaseNameOf";

export const remoteComponentNameOf = (c: ComponentDoc) => {
  return "Remote" + remoteComponentBaseNameOf(c) + "Element";
};
