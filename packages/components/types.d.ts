/// <reference types="vite/client" />

declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.locale.json" {
  import { LocalizedStrings } from "react-aria";
  const langFile: LocalizedStrings;
  export default langFile;
}
