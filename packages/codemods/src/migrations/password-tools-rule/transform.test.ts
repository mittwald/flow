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
 * The entry was still called `password-tools` when this change shipped — the
 * rename to `mittwald-password-tools-js` is a later migration, and `since` runs
 * it _after_ this one. So this is the spelling a consumer coming from before
 * alpha.802 actually has, and matching only the current name meant the rename
 * afterwards carried `AsyncRule` onto an entry that does not export it.
 * `pipeline.test.ts` covers the same gap through the whole chain.
 */
describe("the entry under the name it had at the time", () => {
  test("collapses the rule classes on the pre-rename subpath too", () => {
    const source = `import { AsyncRule, SyncRule } from "@mittwald/flow-react-components/password-tools";

export class A extends AsyncRule {}
export class B extends SyncRule {}
`;

    expect(runTransform(transform, source))
      .toBe(`import { Rule } from "@mittwald/flow-react-components/password-tools";

export class A extends Rule {}
export class B extends Rule {}
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
