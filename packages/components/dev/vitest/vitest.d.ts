import { type Locator } from "vitest/browser";

// Mirrors the `vitest/browser` augmentations declared for the `src` program
// (src/types.d.ts, src/lib/dev/vitest.ts) so files in the `dev` tsconfig
// project (e.g. setupBrowser.ts) also see the custom command and locator.
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
  interface LocatorSelectors {
    getByLocator(locator: string): Locator;
  }
}
