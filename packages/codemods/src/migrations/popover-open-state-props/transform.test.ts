import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "popover-open-state-props";

describe(transform, () => {
  test("renames the prop on all three components", () => {
    const source = `import {
  ContextMenu,
  ContextualHelp,
  Popover,
} from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Popover defaultOpen />
    <ContextualHelp defaultOpen={showHint} />
    <ContextMenu defaultOpen>Items</ContextMenu>
  </>
);
`;

    const result = runTransform(transform, source);

    expect(result).toContain("<Popover isDefaultOpen />");
    expect(result).toContain("<ContextualHelp isDefaultOpen={showHint} />");
    expect(result).toContain("<ContextMenu isDefaultOpen>");
    expect(result).not.toContain("defaultOpen=");
  });

  test("resolves an alias and a namespace import", () => {
    const source = `import { Popover as Pop } from "@mittwald/flow-react-components";
import * as Flow from "@mittwald/flow-remote-react-components";

export const A = () => (
  <>
    <Pop defaultOpen />
    <Flow.ContextualHelp defaultOpen />
  </>
);
`;

    const result = runTransform(transform, source);

    expect(result).toContain("<Pop isDefaultOpen />");
    expect(result).toContain("<Flow.ContextualHelp isDefaultOpen />");
  });

  /**
   * `defaultOpen` is react-aria's own prop on these, passed straight through
   * and unchanged — renaming it would remove a working prop.
   */
  test("leaves defaultOpen alone on every other component", () => {
    const source = `import {
  DatePicker,
  DateRangePicker,
  Select,
  Tooltip,
  TooltipTrigger,
} from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Select defaultOpen />
    <Tooltip defaultOpen />
    <TooltipTrigger defaultOpen />
    <DatePicker defaultOpen />
    <DateRangePicker defaultOpen />
  </>
);
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("leaves a same-named component from another package alone", () => {
    const source = `import { Popover } from "some-other-library";

export const A = () => <Popover defaultOpen />;
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("drops the stale prop when isDefaultOpen is already there", () => {
    const source = `import { Popover } from "@mittwald/flow-react-components";

export const A = () => <Popover defaultOpen isDefaultOpen={false} />;
`;

    const result = runTransform(transform, source);

    expect(result).toContain("<Popover isDefaultOpen={false} />");
    expect(result).not.toContain("defaultOpen ");
  });
});

/**
 * Consumers run codemods one after another, so a second pass over already
 * migrated code has to be a no-op — see `src/tests/transformCoverage.test.ts`
 * for why every transform is required to prove this.
 */
describe("running it twice changes nothing", () => {
  test("stays idempotent", () => {
    const source = `import {
  Popover,
  Select,
} from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Popover defaultOpen />
    <Popover isDefaultOpen />
    <Select defaultOpen />
  </>
);
`;

    const once = runTransform(transform, source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
