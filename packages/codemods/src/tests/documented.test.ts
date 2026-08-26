import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import { transformsDir } from "./runTransform";

/**
 * A consumer only ever reaches a codemod through the URL in a migration guide,
 * so a guide naming a transform that does not exist is the same failure as a
 * transform that cannot run: the command dies instead of migrating anything. A
 * transform nobody links to is unreachable in the other direction.
 */
const guides = [
  "../../../components/MIGRATION.md",
  "../../../../apps/docs/src/content/01-get-started/versioning/index.mdx",
].map((path) =>
  readFileSync(fileURLToPath(new URL(path, import.meta.url)), "utf8"),
);

const documented = new Set(
  guides.flatMap((guide) =>
    [...guide.matchAll(/transforms\/([A-Za-z0-9]+)\.ts/g)].map(
      (match) => match[1] as string,
    ),
  ),
);

const shipped = readdirSync(transformsDir)
  .filter((file) => file.endsWith(".ts"))
  .map((file) => file.replace(/\.ts$/, ""));

describe("the migration guides and the transforms agree", () => {
  test.for([...documented].toSorted())(
    "%s is documented and exists",
    (name) => {
      expect(shipped).toContain(name);
    },
  );

  /**
   * `flowRemote` ports an app to `@mittwald/flow-remote-react-components`. It
   * is a tool, not a migration, so it has no entry in the migration guide — and
   * no consumer-facing home anywhere else yet either.
   */
  const undocumentedOnPurpose = ["flowRemote"];

  test("every other transform is documented somewhere", () => {
    expect(shipped.filter((name) => !documented.has(name)).toSorted()).toEqual(
      undocumentedOnPurpose,
    );
  });
});
