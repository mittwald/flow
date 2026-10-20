import { crossVersion, testEnvironments } from "@/tests/lib/environments";
import { expect, onTestFinished, test } from "vitest";

// Older versions have no `Bar`, so the host renders `undefined` as an
// element type and fails with "Element type is invalid".
const barSince = "1.2.0-next.6";

test.each(testEnvironments)(
  "CartesianChart (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      CartesianChart,
      CartesianGrid,
      Area,
      XAxis,
      YAxis,
      ChartLegend,
      Line,
    },
  }) => {
    await render(
      <CartesianChart
        height="300px"
        data={[
          {
            name: "Stat 1",
            first: 40,
            second: 24,
            third: 75,
          },
          {
            name: "Stat 2",
            first: 30,
            second: 13,
            third: 50,
          },
          {
            name: "Stat 3",
            first: 20,
            second: 68,
            third: 100,
          },
        ]}
      >
        <CartesianGrid />
        <Area dataKey="first" />
        <Area dataKey="second" color="#555" />
        <Line dataKey="third" color="magenta" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartLegend />
      </CartesianChart>,
    );

    await testScreenshot("CartesianChart");
  },
);

test.each(testEnvironments)(
  "CartesianChart EmptyView (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      CartesianChart,
      CartesianGrid,
      IllustratedMessage,
      IconMonitoring,
      Heading,
      Area,
      XAxis,
      YAxis,
      ChartLegend,
      Line,
    },
  }) => {
    await render(
      <CartesianChart
        height="300px"
        data={[]}
        emptyView={
          <IllustratedMessage>
            <IconMonitoring />
            <Heading>Keine Daten verfügbar</Heading>
          </IllustratedMessage>
        }
      >
        <CartesianGrid />
        <Area dataKey="first" />
        <Area dataKey="second" color="#555" />
        <Line dataKey="third" color="magenta" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartLegend />
      </CartesianChart>,
    );

    await testScreenshot("CartesianChart EmptyView");
  },
);

const barChartData = [
  {
    name: "Production Webshop",
    first: 40,
    second: 24,
    third: 75,
  },
  {
    name: "Staging Webshop",
    first: 30,
    second: 13,
    third: 50,
  },
  {
    name: "Company Blog",
    first: 20,
    second: 68,
    third: 100,
  },
];

test.skipIf(crossVersion({ below: barSince })).each(testEnvironments)(
  "CartesianChart with Bars (%s)",
  async ({
    testScreenshot,
    render,
    components: {
      CartesianChart,
      ChartGrid,
      Bar,
      Line,
      XAxis,
      YAxis,
      ChartLegend,
    },
  }) => {
    await render(
      <CartesianChart height="300px" data={barChartData}>
        <ChartGrid />
        <Bar dataKey="first" />
        <Bar dataKey="second" color="palatinate-blue" />
        <Line dataKey="third" color="magenta" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartLegend />
      </CartesianChart>,
    );

    await testScreenshot("CartesianChart with Bars");
  },
);

test.skipIf(crossVersion({ below: barSince })).each(testEnvironments)(
  "CartesianChart with stacked Bars (%s)",
  async ({
    testScreenshot,
    render,
    components: { CartesianChart, ChartGrid, Bar, XAxis, YAxis, ChartLegend },
  }) => {
    await render(
      <CartesianChart height="300px" data={barChartData}>
        <ChartGrid />
        <Bar dataKey="first" stackId="stack" />
        <Bar dataKey="second" color="palatinate-blue" stackId="stack" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartLegend />
      </CartesianChart>,
    );

    await testScreenshot("CartesianChart with stacked Bars");
  },
);

test.skipIf(crossVersion({ below: barSince })).each(testEnvironments)(
  "CartesianChart with horizontal Bars (%s)",
  async ({
    testScreenshot,
    render,
    components: { CartesianChart, ChartGrid, Bar, XAxis, YAxis, ChartLegend },
  }) => {
    await render(
      <CartesianChart height="300px" layout="vertical" data={barChartData}>
        <ChartGrid vertical horizontal={false} />
        <Bar dataKey="first" />
        <Bar dataKey="second" color="palatinate-blue" />
        <XAxis />
        <YAxis dataKey="name" />
        <ChartLegend />
      </CartesianChart>,
    );

    await testScreenshot("CartesianChart with horizontal Bars");
  },
);

/**
 * The left edge of the widest y-axis tick label in the SVG's user units —
 * negative when the label sticks out of the chart. `NaN` until every label is
 * rendered, so a poll cannot pass on an empty axis.
 */
const leftmostYAxisLabelEdge = (container: HTMLElement) => {
  const labels = container.querySelectorAll<SVGTextElement>(
    ".recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value",
  );
  return labels.length === barChartData.length
    ? Math.min(...[...labels].map((label) => label.getBBox().x))
    : Number.NaN;
};

/*
 * A CSS `zoom` around the chart — the docs preview shrinks its examples this way
 * on small screens. Recharts measured the labels in zoomed screen pixels and
 * sized the category axis that much too narrow, so the longest label stuck out
 * of the chart.
 */
test.skipIf(crossVersion({ below: barSince })).each(testEnvironments)(
  "CartesianChart with horizontal Bars under CSS zoom (%s)",
  async ({
    testScreenshot,
    render,
    container,
    components: { CartesianChart, ChartGrid, Bar, XAxis, YAxis },
  }) => {
    document.body.style.zoom = "0.85";
    onTestFinished(() => {
      document.body.style.zoom = "";
    });

    await render(
      <CartesianChart height="300px" layout="vertical" data={barChartData}>
        <ChartGrid vertical horizontal={false} />
        <Bar dataKey="first" />
        <XAxis />
        <YAxis dataKey="name" />
      </CartesianChart>,
    );

    await expect
      .poll(() => leftmostYAxisLabelEdge(container.element() as HTMLElement))
      .toBeGreaterThanOrEqual(0);

    await testScreenshot("CartesianChart with horizontal Bars under CSS zoom");
  },
);
