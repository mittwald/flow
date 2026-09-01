import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "align-to-combine";

describe(transform, () => {
  test("renames the component and its props type", () => {
    const source = `import { Align, type AlignProps } from "@mittwald/flow-react-components";

export const A = (props: AlignProps) => <Align {...props} />;
`;

    expect(runTransform(transform, source))
      .toBe(`import { Combine, type CombineProps } from "@mittwald/flow-react-components";

export const A = (props: CombineProps) => <Combine {...props} />;
`);
  });

  test("renames an aliased import and keeps the alias", () => {
    const source = `import { Align as Row, type AlignProps as RowProps } from "@mittwald/flow-react-components";

export const A = (props: RowProps) => <Row {...props} />;
`;

    expect(runTransform(transform, source))
      .toBe(`import { Combine as Row, type CombineProps as RowProps } from "@mittwald/flow-react-components";

export const A = (props: RowProps) => <Row {...props} />;
`);
  });

  test("collapses the collision with a name the file already imports", () => {
    const source = `import { Align, Combine, type AlignProps } from "@mittwald/flow-react-components";

export const A = (props: AlignProps) => (
  <Combine>
    <Align {...props} />
  </Combine>
);
`;

    // Without the collapse this would be `{ Combine, Combine, ... }`, which
    // does not parse.
    expect(runTransform(transform, source))
      .toBe(`import { Combine, type CombineProps } from "@mittwald/flow-react-components";

export const A = (props: CombineProps) => (
  <Combine>
    <Combine {...props} />
  </Combine>
);
`);
  });

  test("keeps the value import when it collides with a type-only one", () => {
    const source = `import { type Align, Combine } from "@mittwald/flow-react-components";

export const A = () => <Combine />;
`;

    expect(runTransform(transform, source))
      .toBe(`import { Combine } from "@mittwald/flow-react-components";

export const A = () => <Combine />;
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
    const source = `import { Align, Combine, type AlignProps } from "@mittwald/flow-react-components";

export const A = (props: AlignProps) => (
  <Combine>
    <Align {...props} />
  </Combine>
);
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
