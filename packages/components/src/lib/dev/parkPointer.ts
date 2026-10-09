import { page } from "vitest/browser";

/*
 * The pointer stays where the last test, or test file, left it, and Firefox
 * hovers whatever a test renders underneath. Tests render from the top left, so
 * this parks it in the opposite corner. Opt-in per file: moving the pointer
 * before every test breaks Tooltip's keyboard-focus test.
 */
export const parkPointer = () =>
  page.elementLocator(document.documentElement).hover({
    position: { x: window.innerWidth - 1, y: window.innerHeight - 1 },
    force: true,
  });
