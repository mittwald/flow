import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "button-color-accent-to-success";

describe(transform, () => {
  test("rewrites the accent literal", () => {
    const source = `import { Button } from "@mittwald/flow-react-components";

export const A = () => <Button color="accent" />;
`;

    expect(runTransform(transform, source))
      .toBe(`import { Button } from "@mittwald/flow-react-components";

export const A = () => <Button color="success" />;
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
    const source = `import { Button } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Button color="accent" />
    <Button color="success" />
  </>
);
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
