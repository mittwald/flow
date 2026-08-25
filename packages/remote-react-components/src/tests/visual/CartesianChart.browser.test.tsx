import { testEnvironments } from "@/tests/lib/environments";
import { test } from "vitest";

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
];

test.each(testEnvironments)(
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

test.each(testEnvironments)(
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

test.each(testEnvironments)(
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
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" />
        <ChartLegend />
      </CartesianChart>,
    );

    await testScreenshot("CartesianChart with horizontal Bars");
  },
);
