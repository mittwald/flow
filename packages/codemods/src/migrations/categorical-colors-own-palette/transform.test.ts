import { describe, expect, test } from "vitest";
import { runTransform } from "../../tests/runTransform";

const transform = "categorical-colors-own-palette";

describe(transform, () => {
  test("renames every deprecated value by its slot in the default order", () => {
    const source = `import { Area, Bar, Line, LegendItem } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Area color="sea-green" />
    <Area color="palatinate-blue" />
    <Bar color="tangerine" />
    <Bar color="magenta" />
    <Line color="tropical-indigo" />
    <Line color="malachite" />
    <LegendItem color="azure" />
    <LegendItem color={"yellow"} />
    <LegendItem color='alloy-orange' />
    <Area color="lime" />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { Area, Bar, Line, LegendItem } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Area color="indigo" />
    <Area color="amber" />
    <Bar color="teal" />
    <Bar color="violet" />
    <Line color="berry" />
    <Line color="green" />
    <LegendItem color="blue" />
    <LegendItem color={"cyan"} />
    <LegendItem color="plum" />
    <Area color="red" />
  </>
);
`);
  });

  /**
   * `violet` and `green` stay valid names; custom colors are no categorical
   * value.
   */
  test("leaves the kept names and custom colors", () => {
    const source = `import { Area, Line } from "@mittwald/flow-react-components";

export const A = () => (
  <>
    <Area color="violet" />
    <Line color="green" />
    <Line color="#ff0000" />
    <Line color={someColor} />
  </>
);
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("resolves aliases, namespaces and subpath entries", () => {
    const source = `import { Area as ChartArea } from "@mittwald/flow-react-components/CartesianChart";
import * as Flow from "@mittwald/flow-remote-react-components";

export const A = () => (
  <>
    <ChartArea color="magenta" />
    <Flow.Bar color="lime" />
    <Flow.LegendItem color="azure" />
    <Flow.Button color="magenta" />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { Area as ChartArea } from "@mittwald/flow-react-components/CartesianChart";
import * as Flow from "@mittwald/flow-remote-react-components";

export const A = () => (
  <>
    <ChartArea color="violet" />
    <Flow.Bar color="red" />
    <Flow.LegendItem color="blue" />
    <Flow.Button color="magenta" />
  </>
);
`);
  });

  test("follows what typedCartesianChart() returns", () => {
    const source = `import { typedCartesianChart } from "@mittwald/flow-react-components";
import * as Flow from "@mittwald/flow-remote-react-components";

const CartesianChart = typedCartesianChart<{ a: number }>();
const { Bar, Line: ChartLine } = Flow.typedCartesianChart();

export const A = () => (
  <CartesianChart.Chart data={[]}>
    <CartesianChart.Area dataKey="a" color="sea-green" />
    <CartesianChart.Bar dataKey="a" color="palatinate-blue" />
    <CartesianChart.Line dataKey="a" color="tangerine" />
    <CartesianChart.XAxis dataKey="a" color="tangerine" />
    <Bar dataKey="a" color="yellow" />
    <ChartLine dataKey="a" color="azure" />
  </CartesianChart.Chart>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { typedCartesianChart } from "@mittwald/flow-react-components";
import * as Flow from "@mittwald/flow-remote-react-components";

const CartesianChart = typedCartesianChart<{ a: number }>();
const { Bar, Line: ChartLine } = Flow.typedCartesianChart();

export const A = () => (
  <CartesianChart.Chart data={[]}>
    <CartesianChart.Area dataKey="a" color="indigo" />
    <CartesianChart.Bar dataKey="a" color="amber" />
    <CartesianChart.Line dataKey="a" color="teal" />
    <CartesianChart.XAxis dataKey="a" color="tangerine" />
    <Bar dataKey="a" color="cyan" />
    <ChartLine dataKey="a" color="blue" />
  </CartesianChart.Chart>
);
`);
  });

  test("rewrites a value position inside a dynamic value", () => {
    const source = `import { Line } from "@mittwald/flow-react-components";

export const A = ({ flag }: { flag: boolean }) => (
  <>
    <Line color={flag ? "violet" : "magenta"} />
    <Line color={override ?? "lime"} />
    <Line color={override || "azure"} />
    <Line color={flag && "yellow"} />
    <Line color={palette["magenta"]} />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { Line } from "@mittwald/flow-react-components";

export const A = ({ flag }: { flag: boolean }) => (
  <>
    <Line color={flag ? "violet" : "violet"} />
    <Line color={override ?? "red"} />
    <Line color={override || "blue"} />
    <Line color={flag && "cyan"} />
    <Line color={palette["magenta"]} />
  </>
);
`);
  });

  test("renames the colors in a segments array literal", () => {
    const source = `import { DonutChart, ProgressBar } from "@mittwald/flow-react-components";

export const A = ({ flag }: { flag: boolean }) => (
  <>
    <DonutChart
      segments={[
        { title: "Mail", value: 2, color: "magenta" },
        { title: "Web", value: 3, "color": flag ? "lime" : "green" },
        { title: "Other", value: 1 },
      ]}
    />
    <ProgressBar segments={[{ title: "DB", value: 4, color: 'tangerine' }] as const} />
  </>
);
`;

    expect(runTransform(transform, source))
      .toBe(`import { DonutChart, ProgressBar } from "@mittwald/flow-react-components";

export const A = ({ flag }: { flag: boolean }) => (
  <>
    <DonutChart
      segments={[
        { title: "Mail", value: 2, color: "violet" },
        { title: "Web", value: 3, "color": flag ? "red" : "green" },
        { title: "Other", value: 1 },
      ]}
    />
    <ProgressBar segments={[{ title: "DB", value: 4, color: "teal" }] as const} />
  </>
);
`);
  });

  test("follows a const array used only as segments", () => {
    const source = `import { DonutChart } from "@mittwald/flow-react-components";
import type { DonutChartSegment } from "@mittwald/flow-react-components";

const segments: DonutChartSegment[] = [
  { title: "Mail", value: 2, color: "azure" },
  { title: "Web", value: 3, color: "alloy-orange" },
];

export const A = () => <DonutChart segments={segments} />;
`;

    expect(runTransform(transform, source))
      .toBe(`import { DonutChart } from "@mittwald/flow-react-components";
import type { DonutChartSegment } from "@mittwald/flow-react-components";

const segments: DonutChartSegment[] = [
  { title: "Mail", value: 2, color: "blue" },
  { title: "Web", value: 3, color: "plum" },
];

export const A = () => <DonutChart segments={segments} />;
`);
  });

  /** A shared or exported array may feed something that is not a Flow chart. */
  test("leaves a segments array that is read elsewhere", () => {
    const source = `import { DonutChart, ProgressBar } from "@mittwald/flow-react-components";

const shared = [{ title: "Mail", value: 2, color: "magenta" }];
export const exported = [{ title: "Mail", value: 2, color: "magenta" }];
let mutable = [{ title: "Mail", value: 2, color: "magenta" }];

export const A = () => (
  <>
    <DonutChart segments={shared} />
    <OtherChart segments={shared} />
    <ProgressBar segments={exported} />
    <ProgressBar segments={mutable} />
  </>
);
`;

    expect(runTransform(transform, source)).toBe(source);
  });

  test("leaves same-named components from other packages", () => {
    const source = `import { Area, DonutChart } from "somewhere-else";

export const A = () => (
  <>
    <Area color="magenta" />
    <DonutChart segments={[{ title: "Mail", value: 2, color: "magenta" }]} />
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
    const source = `import { Area, DonutChart } from "@mittwald/flow-react-components";

const segments = [{ title: "Mail", value: 2, color: "sea-green" }];

export const A = () => (
  <>
    <Area color="magenta" />
    <Area color="violet" />
    <DonutChart segments={segments} />
    <DonutChart segments={[{ title: "Web", value: 1, color: "tangerine" }]} />
  </>
);
`;

    const once = runTransform(transform, source);
    expect(once).not.toBe(source);
    expect(runTransform(transform, once)).toBe(once);
  });
});
