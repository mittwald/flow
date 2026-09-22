/*
 * The opt-in layered stylesheet variant. Everything Flow ships lives in
 * `@layer flow.*` here, which loses against unlayered CSS regardless of
 * specificity — including the stylesheets dependencies inject at runtime. The
 * tests in `src/tests/layered/` guard the rules that have to win anyway.
 *
 * Same source entry as the default project; what makes this one layered is the
 * absence of the `flow-unlayered-styles` plugin, plus the release build's layer
 * plugin for the component modules (see `vitest.config.ts`).
 */
import "@/styles/index.scss";
import { commands, locators } from "vitest/browser";

beforeEach(async () => {
  await commands.setReducedMotion("reduce");
});

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
