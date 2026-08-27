import { readdirSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { runTransform, transformsDir } from "./runTransform";

/**
 * A codemod changes files in place, and consumers run them one after another.
 * So a second run has to be a no-op: a transform that keeps rewriting what it
 * already rewrote would corrupt a file on the second pass, and one that
 * reformats on every run would bury the real change in diff noise.
 *
 * Each fixture carries the cases that could break the property: values the
 * transform must leave alone, elements it already migrated, and an import it
 * has already rewritten.
 */
const fixtures: Record<string, string> = {
  flow020: `import { Button } from "@mittwald/flow-react-components/components/Button";
import { Text } from "@mittwald/flow-react-components/components/Text";
import { useForm } from "@mittwald/flow-react-components/react-hook-form/x";
import "@mittwald/flow-react-components/global.css";
`,

  flowAlphaAccentBoxColorToBackgroundColor: `import { AccentBox } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <AccentBox color="gradient" />
    <AccentBox color="dark" />
    <AccentBox color={"green"} />
    <AccentBox color={dynamic} />
    <AccentBox backgroundColor="teal" color="neutral" />
    <AccentBox backgroundColor="blue" />
  </>
);
`,

  flowAlphaActionPropToOnAction: `import { Action } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Action action={run} />
    <Action action={stale} onAction={run} />
    <Action onAction={run} />
  </>
);
`,

  "align-to-combine": `import { Align, Combine, type AlignProps } from "@mittwald/flow-react-components";

export const A = (props: AlignProps) => (
  <Combine>
    <Align {...props} />
  </Combine>
);
`,

  flowAlphaButtonColorAccentToSuccess: `import { Button } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Button color="accent" />
    <Button color="success" />
  </>
);
`,

  flowAlphaColorPrimaryToDefault: `import { Heading, Link } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Heading color="primary" />
    <Link color={"primary"} />
    <Heading color="default" />
  </>
);
`,

  flowAlphaButtonPropsInterfaces: `import type { ButtonProps } from "@mittwald/flow-react-components";
import type { SubmitButtonProps, ResetButtonProps } from "@mittwald/flow-react-components/react-hook-form";

export type A = ButtonProps | SubmitButtonProps | ResetButtonProps;
`,

  flowAlphaMutedActionErrorToAbortActionError: `import { MutedActionError } from "@mittwald/flow-react-components";
import { AbortActionError } from "@mittwald/flow-react-components/internal";

export const run = (error: Error) => {
  throw new MutedActionError();
  MutedActionError.isMutedActionError(error);
  AbortActionError.rethrowIfNotAborted(error);
  if (error.name === "MutedActionError") return;
};
`,

  flowAlphaPasswordToolsRule: `import { AsyncRule, SyncRule, Rule } from "@mittwald/flow-react-components/mittwald-password-tools-js";

export class A extends AsyncRule {}
export class B extends SyncRule {}
export class C extends Rule {}
`,

  flowRemote: `import { Button } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-remote-react-components";
import "@mittwald/flow-react-components/all.css";
`,
};

describe("running a transform twice changes nothing", () => {
  const transformNames = readdirSync(transformsDir)
    .filter((file) => file.endsWith(".ts"))
    .map((file) => file.replace(/\.ts$/, ""));

  test("every transform has a fixture", () => {
    expect(transformNames.toSorted()).toEqual(Object.keys(fixtures).toSorted());
  });

  test.for(transformNames)("%s", (name) => {
    const once = runTransform(name, fixtures[name] ?? "");
    expect(runTransform(name, once)).toBe(once);
  });
});
