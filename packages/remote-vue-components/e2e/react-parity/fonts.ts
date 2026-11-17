/**
 * The visual suite's font setup, for both parity harnesses: every face
 * `fonts.scss` declares is loaded before anything renders. See
 * `remote-react-components/dev/vitest/setupBrowser.ts` for why.
 */
export const loadFonts = async (): Promise<void> => {
  await Promise.all(Array.from(document.fonts, (face) => face.load()));
  await document.fonts.ready;
};
