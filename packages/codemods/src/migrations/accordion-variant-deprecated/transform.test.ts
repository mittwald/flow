import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "accordion-variant-deprecated";

describe(transform, () => {
  test("removes the variant prop, whatever its value", () => {
    const source = `import { Accordion } from "@mittwald/flow-react-components";

export const A = ({ outline }: { outline: boolean }) => (
  <>
    <Accordion variant="outline" defaultExpanded />
    <Accordion variant="default" />
    <Accordion variant={outline ? "outline" : "default"} />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { Accordion } from "@mittwald/flow-react-components";

export const A = ({ outline }: { outline: boolean }) => (
  <>
    <Accordion defaultExpanded />
    <Accordion />
    <Accordion />
  </>
);
`);
  });

  test("follows aliases, namespaces and the remote package", () => {
    const source = `import { Accordion as Disclosure } from "@mittwald/flow-react-components";
import * as Flow from "@mittwald/flow-remote-react-components";

export const A = () => (
  <>
    <Disclosure variant="outline" />
    <Flow.Accordion variant="outline" />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { Accordion as Disclosure } from "@mittwald/flow-react-components";
import * as Flow from "@mittwald/flow-remote-react-components";

export const A = () => (
  <>
    <Disclosure />
    <Flow.Accordion />
  </>
);
`);
  });

  test("leaves other components and other packages alone", () => {
    const source = `import { Button } from "@mittwald/flow-react-components";
import { Accordion } from "some-other-library";

export const A = () => (
  <>
    <Button variant="soft" />
    <Accordion variant="outline" />
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
    const source = `import { Accordion } from "@mittwald/flow-react-components";

export const A = () => <Accordion variant="outline" />;
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
