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

  test("rewrites a value position inside a dynamic value", () => {
    const source = `import { Heading } from "@mittwald/flow-react-components";

export const A = ({ flag }: { flag: boolean }) => (
  <>
    <Heading color={flag ? "secondary" : "primary"} />
    <Heading color={override ?? "primary"} />
    <Heading color={flag && "primary"} />
  </>
);
`;

    expect(runTransform(transform, source)).toContain(
      `color={flag ? "secondary" : "default"}`,
    );
    expect(runTransform(transform, source)).toContain(
      `color={override ?? "default"}`,
    );
    expect(runTransform(transform, source)).toContain(
      `color={flag && "default"}`,
    );
  });

  /**
   * The rule is "a position whose value can reach the prop", not "any `primary`
   * string in the attribute". A lookup key is not a value, and `&&` yields its
   * left operand only when that operand is falsy — a non-empty string never
   * is.
   */
  test("leaves a string that never becomes the value", () => {
    const source = `import { Heading } from "@mittwald/flow-react-components";

const shade = { primary: 1 };

export const A = () => (
  <>
    <Heading color={shade["primary"]} />
    <Heading color={"primary" && "secondary"} />
    <Heading color={fromSomewhereElse} />
  </>
);
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
