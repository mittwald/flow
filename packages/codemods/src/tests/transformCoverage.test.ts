import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const migrationsDir = fileURLToPath(new URL("../migrations", import.meta.url));

/**
 * A codemod changes files in place, and consumers run them one after another.
 * So a second run has to be a no-op: a transform that keeps rewriting what it
 * already rewrote would corrupt a file on the second pass, and one that
 * reformats on every run would bury the real change in diff noise.
 *
 * `selectEntries` (`src/catalog/select.ts`) leans on exactly this: it runs
 * codemods with no lower bound, offering already-applied ones as harmless
 * catch-up. That is only safe because every transform is proven idempotent — so
 * the proof cannot be optional.
 *
 * The proof itself now lives beside each transform: `src/migrations/<id>/`
 * carries both `transform.ts` and `transform.test.ts`, and the latter's
 * "running it twice changes nothing" case is what actually runs the transform
 * twice and compares the output. That per-file test alone does not guarantee
 * coverage, though — a new transform whose author forgot the test file would
 * simply never be tested, silently. This file is the guard against that: it
 * scans the directories directly, independent of what any individual test file
 * claims to do, and fails the moment a `transform.ts` shows up with no
 * `transform.test.ts` next to it.
 *
 * `to-remote-package` (`src/tools/to-remote-package.ts`) sits outside this scan
 * on purpose — it has no catalogue entry, so it is not one of these
 * directories. Its own idempotency case lives in
 * `src/tools/to-remote-package.test.ts`.
 */
describe("every transform has a co-located test", () => {
  test("every migrations/*/ directory with transform.ts also has transform.test.ts", () => {
    const missing = readdirSync(migrationsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .filter((entry) =>
        existsSync(join(migrationsDir, entry.name, "transform.ts")),
      )
      .filter(
        (entry) =>
          !existsSync(join(migrationsDir, entry.name, "transform.test.ts")),
      )
      .map((entry) => entry.name);

    expect(missing).toEqual([]);
  });
});
