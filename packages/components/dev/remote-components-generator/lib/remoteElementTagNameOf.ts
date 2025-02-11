import type { ComponentDoc } from "react-docgen-typescript";
import { remoteComponentBaseNameOf } from "./remoteComponentBaseNameOf";

const kebabCase = (str: string): string =>
  str.replace(
    /[A-Z]+(?![a-z])|[A-Z]/g,
    ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
  );

export const remoteElementTagNameOf = (c: ComponentDoc) =>
  "flr-" + kebabCase(remoteComponentBaseNameOf(c));
