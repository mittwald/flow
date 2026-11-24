// A script file (no top-level import/export): wildcard module declarations
// are only valid outside a module.
declare module "*.grammar" {
  import type { LRParser } from "@lezer/lr";
  export const parser: LRParser;
}

declare module "*.locale.json" {
  import type { LocalizedStrings } from "react-aria";
  const langFile: LocalizedStrings;
  export default langFile;
}
