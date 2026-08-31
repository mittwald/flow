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

  test("rewrites a value position inside a dynamic value", () => {
    const source = `import { Button } from "@mittwald/flow-react-components";

export const A = ({ flag }: { flag: boolean }) => (
  <>
    <Button color={flag ? "secondary" : "accent"} />
    <Button color={override ?? "accent"} />
    <Button color={flag && "accent"} />
  </>
);
`;

    expect(runTransform(transform, source)).toContain(
      `color={flag ? "secondary" : "success"}`,
    );
    expect(runTransform(transform, source)).toContain(
      `color={override ?? "success"}`,
    );
    expect(runTransform(transform, source)).toContain(
      `color={flag && "success"}`,
    );
  });

  /**
   * The rule is "a position whose value can reach the prop", not "any `accent`
   * string in the attribute". A lookup key is not a value, and `&&` yields its
   * left operand only when that operand is falsy — a non-empty string never
   * is.
   */
  test("leaves a string that never becomes the value", () => {
    const source = `import { Button } from "@mittwald/flow-react-components";

const shade = { accent: 1 };

export const A = () => (
  <>
    <Button color={shade["accent"]} />
    <Button color={"accent" && "secondary"} />
    <Button color={fromSomewhereElse} />
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
