/// <reference types="vite/client" />
import "@vitest/browser/matchers.d.ts";

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.locale.json" {
  import type { LocalizedStrings } from "react-aria";
  const langFile: LocalizedStrings;
  export default langFile;
}
