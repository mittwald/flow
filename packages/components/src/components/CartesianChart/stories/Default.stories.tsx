import type { Meta, StoryObj } from "@storybook/react";
import CartesianChart, { typedCartesianChart } from "../CartesianChart";
import Area from "../components/Area";
import IllustratedMessage from "@/components/IllustratedMessage";
import { Heading, IconMonitoring } from "@/components/public";
import ChartTooltip from "@/components/CartesianChart/components/ChartTooltip/ChartTooltip";
import ChartGrid from "@/components/CartesianChart/components/ChartGrid/ChartGrid";
import YAxis from "@/components/CartesianChart/components/YAxis/YAxis";
import XAxis from "@/components/CartesianChart/components/XAxis/XAxis";
import ChartLegend from "@/components/CartesianChart/components/ChartLegend/ChartLegend";

const chartData = [
  {
    name: "Tatooine",
    firstKey: 4000,
    secondKey: 2400,
    thirdKey: 2400,
  },
  {
    name: "Hoth",
    firstKey: 3000,
    secondKey: 1398,
    thirdKey: 2210,
  },
  {
    name: "Endor",
    firstKey: 2000,
    secondKey: 9800,
    thirdKey: 2290,
  },
  {
    name: "Naboo",
    firstKey: 2780,
    secondKey: 3908,
    thirdKey: 2000,
  },
  {
    name: "Coruscant",
    firstKey: 1890,
    secondKey: 4800,
    thirdKey: 2181,
  },
  {
    name: "Dagobah",
    firstKey: 2390,
    secondKey: 3800,
    thirdKey: 2500,
  },
  {
    name: "Mustafar",
    firstKey: 3490,
    secondKey: 4300,
    thirdKey: 2100,
  },
];

type Story = StoryObj<typeof CartesianChart>;

const meta: Meta<typeof CartesianChart> = {
  title: "Data Visualisation/CartesianChart",
  component: CartesianChart,
  parameters: {
    controls: {
      disable: true,
    },
  },
  args: {
    data: chartData,
  },
  argTypes: {},
};

export default meta;

export const Default: Story = {
  render: (props) => (
    <CartesianChart {...props}>
      <Area dataKey="firstKey" />
      <Area dataKey="secondKey" color="palatinate-blue" />
      <Area dataKey="thirdKey" color="#555" />
      <XAxis dataKey="name" />
      <YAxis interval="equidistantPreserveStart" />
      <ChartGrid />
      <ChartLegend />
      <ChartTooltip />
    </CartesianChart>
  ),
};

export const MultipleSynced: Story = {
  render: (props) => (
    <>
      <CartesianChart {...props} syncId="syncedCharts">
        <Area dataKey="firstKey" />
        <Area dataKey="secondKey" color="palatinate-blue" />
        <Area dataKey="thirdKey" color="tangerine" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartGrid />
        <ChartTooltip />
        <ChartLegend />
      </CartesianChart>
      <CartesianChart {...props} syncId="syncedCharts">
        <Area dataKey="firstKey" color="magenta" />
        <Area dataKey="secondKey" color="tropical-indigo" />
        <Area dataKey="thirdKey" color="malachite" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartGrid />
        <ChartLegend />
        <ChartTooltip />
      </CartesianChart>
    </>
  ),
};

export const WithEmptyView: Story = {
  render: () => {
    const emptyView = (
      <IllustratedMessage>
        <IconMonitoring />
        <Heading>No transmissions received</Heading>
      </IllustratedMessage>
    );

    return (
      <CartesianChart emptyView={emptyView}>
        <Area dataKey="firstKey" />
        <Area dataKey="secondKey" color="palatinate-blue" />
        <Area dataKey="thirdKey" color="tangerine" />
        <XAxis dataKey="name" />
        <YAxis interval="equidistantPreserveStart" />
        <ChartGrid />
        <ChartLegend />
        <ChartTooltip />
      </CartesianChart>
    );
  },
};

const lineChartData = [
  {
    time: "00:00",
    mean: 52,
    max: 87,
  },
  {
    time: "01:00",
    mean: 30,
    max: 35,
  },
  {
    time: "02:00",
    mean: 28,
    max: 30,
  },
  {
    time: "03:00",
    mean: 40,
    max: 58,
  },
  {
    time: "04:00",
    mean: 30,
    max: 30,
  },
];

export const WithLine: Story = {
  args: {
    data: lineChartData,
  },
  render: () => {
    interface ChartData {
      Time: Date;
      Fleet: number;
      Squadrons: number;
      Median: number;
    }

    const CartesianChart = typedCartesianChart<ChartData>();

    return (
      <CartesianChart.Chart
        data={[
          {
            Time: new Date(Date.parse("2026-06-11")),
            Fleet: 40,
            Squadrons: 24,
            Median: 32,
          },
          {
            Time: new Date(Date.parse("2026-07-11")),
            Fleet: 30,
            Squadrons: 13,
            Median: 19,
          },
          {
            Time: new Date(Date.parse("2026-08-11")),
            Fleet: 20,
            Squadrons: 78,
            Median: 40,
          },
          {
            Time: new Date(Date.parse("2026-09-11")),
            Fleet: 27,
            Squadrons: 39,
            Median: 33,
          },
        ]}
      >
        <CartesianChart.Line dataKey="Median" color="magenta" unit="ms" />
        <CartesianChart.Area dataKey="Fleet" unit="%" />
        <CartesianChart.Area
          dataKey="Squadrons"
          color="palatinate-blue"
          unit="%"
        />
        <CartesianChart.XAxis
          dataKey="Time"
          tickFormatter={(d) => {
            return Intl.DateTimeFormat("en", {
              month: "short",
              day: "2-digit",
            }).format(d);
          }}
        />
        <CartesianChart.YAxis domain={[0, 100]} unit="%" />
        <CartesianChart.Grid />
        <CartesianChart.Legend />
        <CartesianChart.Tooltip
          headingFormatter={(d) =>
            Intl.DateTimeFormat("en", {
              month: "long",
              day: "2-digit",
            }).format(d)
          }
        />
      </CartesianChart.Chart>
    );
  },
};

export const WithIntlNumberFormat: Story = {
  args: {
    data: lineChartData,
  },
  render: () => (
    <CartesianChart
      data={[
        {
          Time: "00:00",
          Squadrons: 24,
          Droids: 13.42,
        },
        {
          Time: "01:00",
          Squadrons: 13,
          Droids: 13.42,
        },
      ]}
    >
      <Area dataKey="Squadrons" color="palatinate-blue" />
      <Area dataKey="Droids" />
      <XAxis dataKey="Time" />
      <YAxis domain={[0, 100]} />
      <ChartGrid />
      <ChartLegend />
      <ChartTooltip
        formatter={(value, name) =>
          `${name}: ${Intl.NumberFormat(undefined, {
            style: "unit",
            unit: "gigabyte",
          }).format(typeof value === "number" ? value : 0)}`
        }
        progressBarFormatter={(value) =>
          Intl.NumberFormat(undefined, {
            style: "unit",
            unit: "gigabyte",
          }).format(value)
        }
      />
    </CartesianChart>
  ),
};
