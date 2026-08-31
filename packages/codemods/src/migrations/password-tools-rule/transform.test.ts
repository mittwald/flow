import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "password-tools-rule";

describe(transform, () => {
  test("collapses both rule classes onto Rule", () => {
    const source = `import { AsyncRule, SyncRule } from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { AsyncRule as Other } from "some-other-package";

export class A extends AsyncRule {}
export class B extends SyncRule {}
export class C extends Other {}
`;

    expect(runTransform(transform, source))
      .toBe(`import { Rule } from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { AsyncRule as Other } from "some-other-package";

export class A extends Rule {}
export class B extends Rule {}
export class C extends Other {}
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
    const source = `import { AsyncRule, SyncRule, Rule } from "@mittwald/flow-react-components/mittwald-password-tools-js";

export class A extends AsyncRule {}
export class B extends SyncRule {}
export class C extends Rule {}
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
