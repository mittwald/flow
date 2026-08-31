import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "action-prop-to-on-action";

describe(transform, () => {
  test("renames action and drops it when onAction already exists", () => {
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={run} />
    <Action action={stale} onAction={run} />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action onAction={run} />
    <Action onAction={run} />
  </>
);
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
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={run} />
    <Action action={stale} onAction={run} />
    <Action onAction={run} />
  </>
);
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
