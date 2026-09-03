import { commands, locators } from "vitest/browser";
import "@mittwald/flow-react-components/all.css";

/*
 * Both halves run before anything renders, and both are about `fonts.scss`
 * fetching the fonts from cdn.mittwald.de.
 *
 * 1. Serve them from this repository instead — a request that hangs there takes
 *    down every screenshot on the page. See dev/vitest/serveFontsLocally.ts.
 *
 * 2. Load every declared face up front. A font arrives asynchronously however it
 *    is served, and a component that measures text — `Truncate` computes how
 *    much of it fits — measures against the fallback metrics if it renders
 *    first. The screenshot is taken once the face has landed, so the text is
 *    drawn in Inter but broken where the fallback would have broken it, which
 *    shows up as a couple of characters' worth of diff. Over the network that
 *    race was decided by the browser's HTTP cache: the first test file paid for
 *    the request and the rest were served from memory. Nothing caches a routed
 *    response, so every file paid again and `Truncate` started losing.
 *
 * Awaiting the faces removes the race for good rather than trading one timing
 * for another. Reading them off `document.fonts` keeps `fonts.scss` the single
 * source of truth — a face added there is loaded here without an edit.
 */
beforeAll(async () => {
  await commands.serveFontsLocally();
  await Promise.all(Array.from(document.fonts, (face) => face.load()));
  await document.fonts.ready;
});

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
