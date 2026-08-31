import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "button-props-interfaces";

describe(transform, () => {
  test("drops the emptied import when the name is already bound elsewhere", () => {
    const source = `import type { ButtonProps } from "@mittwald/flow-react-components";
import type { SubmitButtonProps, ResetButtonProps } from "@mittwald/flow-react-components/react-hook-form";

export type A = ButtonProps | SubmitButtonProps | ResetButtonProps;
`;

    // `ButtonProps` lives in the package root, not in the react-hook-form
    // entry, so the surviving specifier has to be the one that was already
    // right — and the emptied declaration goes away rather than becoming a
    // side-effect import.
    expect(runTransform(transform, source))
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
    expect(runTransform(transform, source))
      .toBe(`import type { ButtonProps } from "@mittwald/flow-react-components";

export type A = ButtonProps;
`);
  });

  test("keeps the rest of the import it moves out of", () => {
    const source = `import { Button, type SubmitButtonProps } from "@mittwald/flow-react-components/react-hook-form";

export type A = SubmitButtonProps;
export const B = Button;
`;

    expect(runTransform(transform, source))
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

    expect(runTransform(transform, source))
      .toBe(`import type { ButtonProps as P } from "@mittwald/flow-react-components";

export type A = P;
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
    const source = `import type { ButtonProps } from "@mittwald/flow-react-components";
import type { SubmitButtonProps, ResetButtonProps } from "@mittwald/flow-react-components/react-hook-form";

export type A = ButtonProps | SubmitButtonProps | ResetButtonProps;
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
