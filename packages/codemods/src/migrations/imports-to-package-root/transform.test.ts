import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "imports-to-package-root";

describe(transform, () => {
  test("collapses subpath imports onto the package root", () => {
    const source = `import { Button } from "@mittwald/flow-react-components/components/Button";
import "@mittwald/flow-react-components/global.css";
`;

    expect(runTransform(transform, source))
      .toBe(`import { Button } from "@mittwald/flow-react-components";
import "@mittwald/flow-react-components/all.css";
`);
  });
});

/**
 * Consumers run codemods one after another, so a second pass over already
 * migrated code has to be a no-op — see `src/tests/transformCoverage.test.ts`
 * for why every transform is required to prove this.
 */
describe("running it twice changes nothing", () => {
  test("stays idempotent", () => {
    const source = `import { Button } from "@mittwald/flow-react-components/components/Button";
import { Text } from "@mittwald/flow-react-components/components/Text";
import { useForm } from "@mittwald/flow-react-components/react-hook-form/x";
import "@mittwald/flow-react-components/global.css";
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});

/**
 * The two regressions that made the leave-alone set necessary, pinned as
 * fixtures. Idempotency cannot catch either: it proves a second pass over the
 * transform's _own_ output changes nothing, not that an era-specific transform
 * is harmless against code from a later era.
 */
describe("code from a later era is left alone", () => {
  test("every subpath the package still exports survives", () => {
    const source = `import "@mittwald/flow-react-components/all-layered.css";
import { Rule } from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { Button } from "@mittwald/flow-react-components/flr-universal";
import { internals } from "@mittwald/flow-react-components/internal";
import index from "@mittwald/flow-react-components/component-index";
import props from "@mittwald/flow-react-components/doc-properties";
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  /**
   * `password-tools-subpath-renamed` sorts after this entry, so flattening the
   * path first would leave it nothing to find — and move `Rule` onto a root
   * that does not export it, while both transforms report success.
   */
  test("a path another migration renames survives for that migration", () => {
    const source = `import { Rule } from "@mittwald/flow-react-components/password-tools";
`;

    expect(runTransform(transform, source)).toBe(source);
  });
});

/**
 * The leave-alone set names the export surface literally, because the transform
 * ships as a source file in the published package and cannot read the manifest
 * at runtime. This is what keeps the literal honest.
 */
describe("the leave-alone set matches the real export surface", () => {
  test("every subpath the package exports is listed", () => {
    const manifest = JSON.parse(
      readFileSync(
        new URL("../../../../components/package.json", import.meta.url),
        "utf8",
      ),
    ) as { exports: Record<string, unknown> };

    const exported = Object.keys(manifest.exports)
      .filter((entry) => entry !== ".")
      .map((entry) => entry.replace(/^\.\//, ""))
      .toSorted();

    const listed = readFileSync(
      new URL("./transform.ts", import.meta.url),
      "utf8",
    );

    expect(
      exported.filter((subpath) => !listed.includes(`"${subpath}"`)),
    ).toEqual([]);
  });
});
