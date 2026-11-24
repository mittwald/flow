/// <reference types="vite/client" />
import type { JSX as Jsx } from "react/jsx-runtime";

import "@vitest/browser/matchers.d.ts";
import "vitest/globals";
import "@testing-library/jest-dom";

declare global {
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

// Custom properties are how components hand values to their stylesheets.
declare module "react" {
  interface CSSProperties {
    // An interface merge cannot take a Record.
    // oxlint-disable-next-line typescript/consistent-indexed-object-style
    [customProperty: `--${string}`]: string | number | undefined;
  }
}

declare module "vitest/browser" {
  interface BrowserCommands {
    setReducedMotion: (value: string) => Promise<void>;
  }
}
