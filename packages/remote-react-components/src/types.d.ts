/// <reference types="@vitest/browser/providers/playwright" />
/// <reference types="vite/client" />

declare const __FLOW_REMOTE_REACT_COMPONENTS_PACKAGE_VERSION__: string;

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.locale.json" {
  import type { LocalizedStrings } from "react-aria";
  const langFile: LocalizedStrings;
  export default langFile;
}
