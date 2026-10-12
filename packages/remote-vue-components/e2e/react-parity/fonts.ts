import { commands } from "vitest/browser";

declare module "vitest/browser" {
  interface BrowserCommands {
    serveFontsLocally: () => Promise<void>;
  }
}

/**
 * The visual suite's font setup, for both parity harnesses: the faces
 * `fonts.scss` declares against cdn.mittwald.de are served from
 * `remote-react-components/dev/vitest/fonts/` (`serveFontsLocally`, registered
 * in each harness's vitest config) and loaded before anything renders. See
 * `remote-react-components/dev/vitest/setupBrowser.ts` for why both halves are
 * needed.
 */
export const loadFontsLocally = async (): Promise<void> => {
  await commands.serveFontsLocally();
  await Promise.all(Array.from(document.fonts, (face) => face.load()));
  await document.fonts.ready;
};
