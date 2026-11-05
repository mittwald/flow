import { locators } from "vitest/browser";
import "@mittwald/flow-react-components/all.css";

/*
 * Load every declared face before anything renders. A font arrives
 * asynchronously, and a component that measures text — `Truncate` computes how
 * much of it fits — measures against the fallback metrics if it renders first.
 * The screenshot is taken once the face has landed, so the text is drawn in
 * Inter but broken where the fallback would have broken it, which shows up as a
 * couple of characters' worth of diff.
 *
 * Reading the faces off `document.fonts` keeps `fonts.scss` the single source of
 * truth — a face added there is loaded here without an edit.
 */
beforeAll(async () => {
  await Promise.all(Array.from(document.fonts, (face) => face.load()));
  await document.fonts.ready;
});

/*
 * The suites run with `isolate: false`, so a clock a test sets with
 * `vi.setSystemTime` stays set for every file that runs after it on the page.
 * A frozen `Date.now()` stops whatever measures elapsed time: `use-debounce`
 * never sees its wait pass, so PasswordCreationField never rated a password in
 * any scenario that ran after List's date filter (CI shard 3). Hand every test
 * the real clock back.
 */
afterEach(() => {
  vi.useRealTimers();
});

locators.extend({
  getByLocator(locator: string) {
    return locator;
  },
});
