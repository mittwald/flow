import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "cartesian-chart-empty-view";

describe(transform, () => {
  test("wraps an imported component reference", () => {
    const source = `import { CartesianChart } from "@mittwald/flow-react-components";
import { EmptyState } from "./EmptyState";

export const Chart = () => <CartesianChart emptyView={EmptyState} />;
`;

    expect(runTransform(transform, source)).toContain(
      "emptyView={<EmptyState />}",
    );
  });

  test("wraps a component declared in the same file", () => {
    const source = `import { CartesianChart } from "@mittwald/flow-react-components";

function Empty() {
  return <p>nothing</p>;
}
const Blank = () => <p>nothing</p>;

export const A = () => <CartesianChart emptyView={Empty} />;
export const B = () => <CartesianChart emptyView={Blank} />;
`;

    const result = runTransform(transform, source);

    expect(result).toContain("emptyView={<Empty />}");
    expect(result).toContain("emptyView={<Blank />}");
  });

  test("resolves an alias and a namespace import", () => {
    const source = `import { CartesianChart as Chart } from "@mittwald/flow-react-components";
import * as Flow from "@mittwald/flow-remote-react-components";
import { EmptyState } from "./EmptyState";

export const A = () => <Chart emptyView={EmptyState} />;
export const B = () => <Flow.CartesianChart emptyView={EmptyState} />;
`;

    const result = runTransform(transform, source);

    expect(result.match(/emptyView=\{<EmptyState \/>\}/g)).toHaveLength(2);
  });

  test("leaves a value that is already an element alone", () => {
    const source = `import { CartesianChart } from "@mittwald/flow-react-components";
import { EmptyState } from "./EmptyState";

export const Chart = () => <CartesianChart emptyView={<EmptyState />} />;
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  // The whole reason the gate is "the file says it is a component" rather than
  // "the name is PascalCase": wrapping an element-valued variable produces
  // `<Empty />` on a non-component, which is worse than leaving it.
  test("declines an identifier the file binds to an element or nothing", () => {
    const source = `import { CartesianChart } from "@mittwald/flow-react-components";

const Rendered = <p>nothing</p>;

export const A = () => <CartesianChart emptyView={Rendered} />;
export const B = () => <CartesianChart emptyView={fromElsewhere} />;
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("leaves another component's emptyView alone", () => {
    const source = `import { CartesianChart } from "@mittwald/flow-react-components";
import { List } from "@mittwald/flow-react-components";
import { EmptyState } from "./EmptyState";

export const Chart = () => <List emptyView={EmptyState} />;
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("leaves a CartesianChart from another package alone", () => {
    const source = `import { CartesianChart } from "some-other-charts";
import { EmptyState } from "./EmptyState";

export const Chart = () => <CartesianChart emptyView={EmptyState} />;
`;

    expect(runTransform(transform, source)).toBe(source);
  });
});
