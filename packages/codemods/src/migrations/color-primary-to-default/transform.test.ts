import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "color-primary-to-default";

describe(transform, () => {
  test("rewrites the primary literal in both JSX forms", () => {
    const source = `import { Heading, Link } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Heading color="primary" />
    <Link color={"primary"} />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { Heading, Link } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Heading color="default" />
    <Link color={"default"} />
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
    const source = `import { Heading, Link } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Heading color="primary" />
    <Link color={"primary"} />
    <Heading color="default" />
  </>
);
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
