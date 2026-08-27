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

describe("flowAlphaMutedActionErrorToAbortActionError", () => {
  test("renames the class, its static helpers and the name comparison", () => {
    const source = `import { MutedActionError } from "@mittwald/flow-react-components";
import { MutedActionError as Muted } from "@mittwald/flow-react-components/internal";
import * as Flow from "@mittwald/flow-react-components";
import { MutedActionError as Other } from "some-other-package";

export const run = (error: Error) => {
  MutedActionError.isMutedActionError(error);
  Muted.rethrowIfNotMuted(error);
  Flow.MutedActionError.isMutedActionError(error);
  Other.isMutedActionError(error);
  if (error.name === "MutedActionError") return;
  const label = "MutedActionError";
  throw new MutedActionError(label);
};
`;

    // `Other` comes from another package and keeps everything. The bare string
    // is not a comparison, so it stays too.
    expect(runTransform("flowAlphaMutedActionErrorToAbortActionError", source))
      .toBe(`import { AbortActionError } from "@mittwald/flow-react-components";
import { AbortActionError as Muted } from "@mittwald/flow-react-components/internal";
import * as Flow from "@mittwald/flow-react-components";
import { MutedActionError as Other } from "some-other-package";

export const run = (error: Error) => {
  AbortActionError.isAbortActionError(error);
  Muted.rethrowIfNotAborted(error);
  Flow.AbortActionError.isAbortActionError(error);
  Other.isMutedActionError(error);
  if (error.name === "AbortActionError") return;
  const label = "MutedActionError";
  throw new AbortActionError(label);
};
`);
  });
});

describe("flowAlphaPasswordToolsRule", () => {
  test("collapses both rule classes onto Rule", () => {
    const source = `import { AsyncRule, SyncRule } from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { AsyncRule as Other } from "some-other-package";

export class A extends AsyncRule {}
export class B extends SyncRule {}
export class C extends Other {}
`;

    expect(runTransform("flowAlphaPasswordToolsRule", source))
      .toBe(`import { Rule } from "@mittwald/flow-react-components/mittwald-password-tools-js";
import { AsyncRule as Other } from "some-other-package";

export class A extends Rule {}
export class B extends Rule {}
export class C extends Other {}
`);
  });
});

describe("flowAlphaButtonPropsInterfaces", () => {
  test("drops the emptied import when the name is already bound elsewhere", () => {
    const source = `import type { ButtonProps } from "@mittwald/flow-react-components";
import type { SubmitButtonProps, ResetButtonProps } from "@mittwald/flow-react-components/react-hook-form";

export type A = ButtonProps | SubmitButtonProps | ResetButtonProps;
`;

    // `ButtonProps` lives in the package root, not in the react-hook-form
    // entry, so the surviving specifier has to be the one that was already
    // right — and the emptied declaration goes away rather than becoming a
    // side-effect import.
    expect(runTransform("flowAlphaButtonPropsInterfaces", source))
      .toBe(`import type { ButtonProps } from "@mittwald/flow-react-components";

export type A = ButtonProps | ButtonProps | ButtonProps;
`);
  });

  test("moves the import to the package root", () => {
    const source = `import type { SubmitButtonProps } from "@mittwald/flow-react-components/react-hook-form";

export type A = SubmitButtonProps;
`;

    // The react-hook-form entry does not export `ButtonProps`, so renaming in
    // place would swap one import error for another.
    expect(runTransform("flowAlphaButtonPropsInterfaces", source))
      .toBe(`import type { ButtonProps } from "@mittwald/flow-react-components";

export type A = ButtonProps;
`);
  });

  test("keeps the rest of the import it moves out of", () => {
    const source = `import { Button, type SubmitButtonProps } from "@mittwald/flow-react-components/react-hook-form";

export type A = SubmitButtonProps;
export const B = Button;
`;

    expect(runTransform("flowAlphaButtonPropsInterfaces", source))
      .toBe(`import type { ButtonProps } from "@mittwald/flow-react-components";
import { Button } from "@mittwald/flow-react-components/react-hook-form";

export type A = ButtonProps;
export const B = Button;
`);
  });

  test("keeps an alias while moving it", () => {
    const source = `import type { SubmitButtonProps as P } from "@mittwald/flow-react-components/react-hook-form";

export type A = P;
`;

    expect(runTransform("flowAlphaButtonPropsInterfaces", source))
      .toBe(`import type { ButtonProps as P } from "@mittwald/flow-react-components";

export type A = P;
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
