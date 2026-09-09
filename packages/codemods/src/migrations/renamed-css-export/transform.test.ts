import { describe, expect, test } from "vitest";
import { readFileSync } from "node:fs";
import { runTransform } from "../../tests/runTransform";

const transform = "renamed-css-export";

describe(transform, () => {
  test("rewrites the side-effect import, which is how it is nearly always written", () => {
    const source = `import "@mittwald/flow-react-components/styles";\n`;

    expect(runTransform(transform, source)).toContain(
      `import "@mittwald/flow-react-components/all.css"`,
    );
  });

  test("rewrites every other form that names the module too", () => {
    const source = `import "@mittwald/flow-react-components/styles";
import styles from "@mittwald/flow-react-components/styles";
export { something } from "@mittwald/flow-react-components/styles";
export * from "@mittwald/flow-react-components/styles";

const lazy = () => import("@mittwald/flow-react-components/styles");
const sync = require("@mittwald/flow-react-components/styles");
`;

    const result = runTransform(transform, source);

    expect(result).not.toContain(`"@mittwald/flow-react-components/styles"`);
    expect(
      result.match(/@mittwald\/flow-react-components\/all\.css/g),
    ).toHaveLength(6);
  });

  test("leaves another package's styles export alone", () => {
    const source = `import "some-other-package/styles";
import "@mittwald/flow-icons/styles";
import { Button } from "@mittwald/flow-react-components";
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("does not touch the layered stylesheet or a deeper path", () => {
    // `./styles` was a single export with nothing under it, so this transform
    // matches exactly and never prefixes — `all-layered.css` is a deliberate
    // separate choice a consumer may have made.
    const source = `import "@mittwald/flow-react-components/all-layered.css";
import "@mittwald/flow-react-components/styles/extra.css";
`;

    expect(runTransform(transform, source)).toBe(source);
  });
});

/**
 * Consumers run codemods one after another, so a second pass over already
 * migrated code has to be a no-op — see `src/tests/transformCoverage.test.ts`
 * for why every transform is required to prove this.
 */
describe("running it twice changes nothing", () => {
  test("stays idempotent", () => {
    const source = `import "@mittwald/flow-react-components/styles";
import "@mittwald/flow-react-components/all.css";
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});

/**
 * This migration exists because an export stopped existing, so the path the
 * transform writes has to be one the package really exports — and the path it
 * rewrites away from must not be. Read straight from the components manifest,
 * for the same reason `password-tools-subpath-renamed` does:
 * `tests/remoteScope` reads a generated file that `components:build` may be
 * rewriting concurrently.
 */
describe("the rewritten path is one a consumer can import", () => {
  const subpaths = Object.keys(
    (
      JSON.parse(
        readFileSync(
          new URL("../../../../components/package.json", import.meta.url),
          "utf8",
        ),
      ) as { exports: Record<string, unknown> }
    ).exports,
  );

  test("the new path exists and the old one does not", () => {
    expect(subpaths).toContain("./all.css");
    expect(subpaths).not.toContain("./styles");
  });
});
