import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "color-props-brand-palette";

describe(transform, () => {
  test("renames the deprecated values per component", () => {
    const source = `import { AccentBox, Avatar, Badge, Color, Icon } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <AccentBox backgroundColor="violet" color="dark" />
    <AccentBox backgroundColor={"teal"} />
    <AccentBox backgroundColor="gradient" />
    <AccentBox backgroundColor="green" />
    <Badge color="red" />
    <Badge color="green" />
    <Badge color="orange" />
    <Badge color="teal" />
    <Badge color={"violet"} />
    <Avatar color="teal" />
    <Icon color="violet" />
    <Color color="teal" />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { AccentBox, Avatar, Badge, Color, Icon } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <AccentBox backgroundColor="lilac" color="dark" />
    <AccentBox backgroundColor={"sage"} />
    <AccentBox backgroundColor="gradient-navy" />
    <AccentBox backgroundColor="sage" />
    <Badge color="danger" />
    <Badge color="success" />
    <Badge color="warning" />
    <Badge color="sage" />
    <Badge color={"lilac"} />
    <Avatar color="sage" />
    <Icon color="lilac" />
    <Color color="sage" />
  </>
);
`);
  });

  /**
   * `Avatar`'s `green` renders the success mint, its replacement `sage` the
   * brand's gray-green: a different look, so it is the consumer's decision. The
   * status renames belong to `Badge` only.
   */
  test("leaves the values whose replacement looks different", () => {
    const source = `import { Avatar, Icon } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Avatar color="green" />
    <Icon color="red" />
  </>
);
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("rewrites a value position inside a dynamic value", () => {
    const source = `import * as Flow from "@mittwald/flow-remote-react-components";

export const A = ({ flag }: { flag: boolean }) => (
  <>
    <Flow.Badge color={flag ? "neutral" : "red"} />
    <Flow.Badge color={override ?? "orange"} />
  </>
);
`;

    const result = runTransform(transform, source);
    expect(result).toContain(`color={flag ? "neutral" : "danger"}`);
    expect(result).toContain(`color={override ?? "warning"}`);
  });

  test("leaves same-named components from other packages", () => {
    const source = `import { Badge } from "somewhere-else";

export const A = () => <Badge color="red" />;
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
    const source = `import { Badge } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Badge color="red" />
    <Badge color="danger" />
  </>
);
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
