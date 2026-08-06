/*
 * The opt-in layered stylesheet variant. Everything Flow ships lives in
 * `@layer flow.*` here, which loses against unlayered CSS regardless of
 * specificity — including the stylesheets dependencies inject at runtime. The
 * tests in `src/tests/layered/` guard the rules that have to win anyway.
 */
import "../../../stylesheet/dist/styles-layered.css";
import { commands, locators } from "vitest/browser";

beforeEach(async () => {
  await commands.setReducedMotion("reduce");
});

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
