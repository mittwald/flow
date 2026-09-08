import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

/*
 * `serveFontsLocally` answers every font request `fonts.scss` makes from
 * `dev/vitest/fonts/`, so the browser never fetches one over the network — see
 * the comment there for why a hanging font request takes down a whole visual
 * shard (#3106).
 *
 * It serves by file name, so a font added to `fonts.scss` without a copy here
 * would 404 and silently render in the fallback face. This is the guard.
 *
 * Refreshing a file after `fonts.scss` changes:
 *   curl -o dev/vitest/fonts/<name>.woff2 https://cdn.mittwald.de/fonts/<name>.woff2
 * The copies must stay byte-identical to what the CDN serves — the committed
 * screenshots were rendered with those faces.
 */

const here = dirname(fileURLToPath(import.meta.url));
const fontsScss = join(here, "../../../components/src/styles/fonts.scss");
const localFontsDir = join(here, "fonts");

const declaredFonts = [
  ...readFileSync(fontsScss, "utf8").matchAll(
    /url\("https:\/\/cdn\.mittwald\.de\/fonts\/(?<file>[^"]+)"\)/g,
  ),
].flatMap((match) => match.groups?.file ?? []);

describe("the fonts the visual suite renders with", () => {
  test("fonts.scss declares its faces against the CDN", () => {
    expect(declaredFonts.length).toBeGreaterThan(0);
  });

  test.each(declaredFonts)("%s is served from this repository", (file) => {
    expect(readdirSync(localFontsDir)).toContain(file);
  });

  test("no copy here is unused", () => {
    expect(readdirSync(localFontsDir).sort()).toStrictEqual(
      [...declaredFonts].sort(),
    );
  });
});
