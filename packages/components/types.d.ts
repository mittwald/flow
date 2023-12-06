declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "./intl/*.json" {
  import { LocalizedStrings } from "react-aria";
  const langFile: LocalizedStrings;
  export default langFile;
}
