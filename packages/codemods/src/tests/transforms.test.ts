import { describe, expect, test } from "vitest";
import { runTransform } from "./runTransform";

/**
 * One fixture per transform, covering the change it is named after. The narrow
 * scoping rules each transform documents — aliases, namespace imports, other
 * packages, dynamic values — are covered where they are most likely to break,
 * in the transform's own test file.
 */
describe("flowAlphaActionPropToOnAction", () => {
  test("renames action and drops it when onAction already exists", () => {
    const source = `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={run} />
    <Action action={stale} onAction={run} />
  </>
);
`;

    expect(runTransform("flowAlphaActionPropToOnAction", source))
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

describe("flowAlphaColorPrimaryToDefault", () => {
  test("rewrites the primary literal in both JSX forms", () => {
    const source = `import { Heading, Link } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Heading color="primary" />
    <Link color={"primary"} />
  </>
);
`;

    expect(runTransform("flowAlphaColorPrimaryToDefault", source))
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

describe("flowAlphaButtonColorAccentToSuccess", () => {
  test("rewrites the accent literal", () => {
    const source = `import { Button } from "@mittwald/flow-react-components";

export const A = () => <Button color="accent" />;
`;

    expect(runTransform("flowAlphaButtonColorAccentToSuccess", source))
      .toBe(`import { Button } from "@mittwald/flow-react-components";

export const A = () => <Button color="success" />;
`);
  });
});

describe("flowAlphaAlignToCombine", () => {
  test("renames the component and its props type", () => {
    const source = `import { Align, type AlignProps } from "@mittwald/flow-react-components";

export const A = (props: AlignProps) => <Align {...props} />;
`;

    expect(runTransform("flowAlphaAlignToCombine", source))
      .toBe(`import { Combine, type CombineProps } from "@mittwald/flow-react-components";

export const A = (props: CombineProps) => <Combine {...props} />;
`);
  });

  test("renames an aliased import and keeps the alias", () => {
    const source = `import { Align as Row, type AlignProps as RowProps } from "@mittwald/flow-react-components";

export const A = (props: RowProps) => <Row {...props} />;
`;

    expect(runTransform("flowAlphaAlignToCombine", source))
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
    expect(runTransform("flowAlphaAlignToCombine", source))
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

    expect(runTransform("flowAlphaAlignToCombine", source))
      .toBe(`import { Combine } from "@mittwald/flow-react-components";

export const A = () => <Combine />;
`);
  });
});

describe("flow020", () => {
  test("collapses subpath imports onto the package root", () => {
    const source = `import { Button } from "@mittwald/flow-react-components/components/Button";
import "@mittwald/flow-react-components/global.css";
`;

    expect(runTransform("flow020", source))
      .toBe(`import { Button } from "@mittwald/flow-react-components";
import "@mittwald/flow-react-components/all.css";
`);
  });
});

describe("flowRemote", () => {
  test("ports imports to the remote package", () => {
    const source = `import { Button } from "@mittwald/flow-react-components";
`;

    expect(runTransform("flowRemote", source))
      .toBe(`import { Button } from "@mittwald/flow-remote-react-components";
`);
  });
});

describe("flowAlphaAll", () => {
  test("applies every alpha migration in one pass", () => {
    const source = `import { AccentBox, Action, Align, Button, Heading } from "@mittwald/flow-react-components";

export const A = () => (
  <Align>
    <AccentBox color="gradient" />
    <Action action={run} />
    <Button color="accent" />
    <Heading color="primary" />
  </Align>
);
`;

    expect(runTransform("flowAlphaAll", source))
      .toBe(`import { AccentBox, Action, Combine, Button, Heading } from "@mittwald/flow-react-components";

export const A = () => (
  <Combine>
    <AccentBox backgroundColor="gradient" />
    <Action onAction={run} />
    <Button color="success" />
    <Heading color="default" />
  </Combine>
);
`);
  });
});
