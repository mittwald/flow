import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "muted-action-error-to-abort-action-error";

describe(transform, () => {
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
    expect(runTransform(transform, source))
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

/**
 * Consumers run codemods one after another, so a second pass over already
 * migrated code has to be a no-op — see `src/tests/transformCoverage.test.ts`
 * for why every transform is required to prove this.
 */
describe("running it twice changes nothing", () => {
  test("stays idempotent", () => {
    const source = `import { MutedActionError } from "@mittwald/flow-react-components";
import { AbortActionError } from "@mittwald/flow-react-components/internal";

export const run = (error: Error) => {
  throw new MutedActionError();
  MutedActionError.isMutedActionError(error);
  AbortActionError.rethrowIfNotAborted(error);
  if (error.name === "MutedActionError") return;
};
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
