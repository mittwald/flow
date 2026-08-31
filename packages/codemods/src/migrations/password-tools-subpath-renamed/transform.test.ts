import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";
import { packageEntries } from "../../tests/remoteScope";

const transform = "password-tools-subpath-renamed";

describe(transform, () => {
  test("rewrites every form that names the module", () => {
    const source = `import { Rule } from "@mittwald/flow-react-components/password-tools";
import type { RuleResult } from "@mittwald/flow-react-components/password-tools";
export { Rule } from "@mittwald/flow-react-components/password-tools";
export * from "@mittwald/flow-react-components/password-tools";
import "@mittwald/flow-react-components/password-tools";

const lazy = () => import("@mittwald/flow-react-components/password-tools");
const sync = require("@mittwald/flow-react-components/password-tools");
`;

    const result = runTransform(transform, source);

    expect(result).not.toContain(
      `"@mittwald/flow-react-components/password-tools"`,
    );
    expect(
      result.match(
        /@mittwald\/flow-react-components\/mittwald-password-tools-js/g,
      ),
    ).toHaveLength(7);
  });

  test("leaves another package's password-tools alone", () => {
    const source = `import { Rule } from "@mittwald/password-tools-js";
import { Other } from "some-other-package/password-tools";
import { Kept } from "@mittwald/flow-react-components";
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
    const source = `import { Rule } from "@mittwald/flow-react-components/password-tools";
import { Already } from "@mittwald/flow-react-components/mittwald-password-tools-js";
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});

/**
 * This migration exists because a subpath stopped existing, so the path the
 * transform writes has to be one the package really exports — and the path it
 * rewrites away from must not be. `packageEntries` is built from every
 * package's `exports` map, so this fails the moment either side drifts again.
 */
describe("the rewritten path is one a consumer can import", () => {
  test("the new path exists and the old one does not", () => {
    expect(packageEntries).toContain(
      "@mittwald/flow-react-components/mittwald-password-tools-js",
    );
    expect(packageEntries).not.toContain(
      "@mittwald/flow-react-components/password-tools",
    );
  });
});
