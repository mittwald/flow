/// <reference types="vite/client" />
import type { JSX as Jsx } from "react/jsx-runtime";

declare global {
  declare module "*.locale.json" {
    import type { LocalizedStrings } from "react-aria";
    const langFile: LocalizedStrings;
    export default langFile;
  }

  declare module "*.module.css" {
    const classes: Record<string, string>;
    export default classes;
  }

  // React 19 types workaround for outdated types from third party deps
  namespace JSX {
    type ElementType = Jsx.ElementType;
    type ElementClass = Jsx.ElementClass;
    type Element = Jsx.Element;
    type IntrinsicElements = Jsx.IntrinsicElements;
    type ElementAttributesProperty = Jsx.ElementAttributesProperty;
    type ElementChildrenAttribute = Jsx.ElementChildrenAttribute;
    type IntrinsicClassAttributes = Jsx.IntrinsicClassAttributes<never>;
  }
}
