import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "accent-box-color-to-background-color";

describe("accent-box-color-to-background-color", () => {
  test("moves background values and keeps content colors", () => {
    const source = `import { AccentBox } from "@mittwald/flow-react-components";
import * as Flow from "@mittwald/flow-react-components";
import { AccentBox as Box } from "@mittwald/flow-react-components/internal";
import { AccentBox as Other } from "some-other-package";

export const All = () => (
  <>
    <AccentBox color="gradient" />
    <AccentBox color="blue" />
    <AccentBox color="dark" />
    <AccentBox color="default" />
    <AccentBox color={"green"} />
    <AccentBox color={dynamic} />
    <AccentBox backgroundColor="teal" color="neutral" />
    <Flow.AccentBox color="neutral" />
    <Box color="green" />
    <Other color="green" />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { AccentBox } from "@mittwald/flow-react-components";
import * as Flow from "@mittwald/flow-react-components";
import { AccentBox as Box } from "@mittwald/flow-react-components/internal";
import { AccentBox as Other } from "some-other-package";

export const All = () => (
  <>
    <AccentBox backgroundColor="gradient" />
    <AccentBox backgroundColor="blue" />
    <AccentBox color="dark" />
    <AccentBox color="default" />
    <AccentBox backgroundColor={"green"} />
    <AccentBox color={dynamic} />
    <AccentBox backgroundColor="teal" color="neutral" />
    <Flow.AccentBox backgroundColor="neutral" />
    <Box backgroundColor="green" />
    <Other color="green" />
  </>
);
`);
  });

  test("leaves a file without a Flow import alone", () => {
    const source = `import { AccentBox } from "some-other-package";

export const Untouched = () => <AccentBox color="green" />;
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
    const source = `import { AccentBox } from "@mittwald/flow-react-components";

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
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
