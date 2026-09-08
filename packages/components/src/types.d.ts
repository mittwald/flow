/// <reference types="vite/client" />
import type { JSX as Jsx } from "react/jsx-runtime";

import "@vitest/browser/matchers.d.ts";
import "vitest/globals";
import "@testing-library/jest-dom";

declare global {
  declare module "*.grammar" {
    import type { LRParser } from "@lezer/lr";
    export const parser: LRParser;
  }

  declare module "*.locale.json" {
    import type { LocalizedStrings } from "react-aria";
    const langFile: LocalizedStrings;
    export default langFile;
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

declare module "vitest/browser" {
  interface BrowserCommands {
    setReducedMotion: (value: string) => Promise<void>;
    selectTextByDragging: (
      selector: string,
      overshoot?: number,
    ) => Promise<void>;
    dragMouse: (
      from: { x: number; y: number },
      to: { x: number; y: number },
    ) => Promise<void>;
  }
}
