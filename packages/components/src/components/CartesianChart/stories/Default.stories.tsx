import type { Meta, StoryObj } from "@storybook/react";
import CartesianChart from "../CartesianChart";
import Area from "../components/Area";
import IllustratedMessage from "@/components/IllustratedMessage";
import { Heading, IconMonitoring } from "@/components/public";
import { Line } from "@/components/CartesianChart/components/Line";
import ChartTooltip from "@/components/CartesianChart/components/ChartTooltip/ChartTooltip";
import CartesianGrid from "@/components/CartesianChart/components/CartesianGrid/CartesianGrid";
import YAxis from "@/components/CartesianChart/components/YAxis/YAxis";
import XAxis from "@/components/CartesianChart/components/XAxis/XAxis";
import ChartLegend from "@/components/CartesianChart/components/ChartLegend/ChartLegend";
import { sleep } from "@/lib/promises/sleep";

const chartData = [
  {
    name: "Stat 1",
    firstKey: 4000,
    secondKey: 2400,
    thirdKey: 2400,
  },
  {
    name: "Stat 2",
    firstKey: 3000,
    secondKey: 1398,
    thirdKey: 2210,
  },
  {
    name: "Stat 3",
    firstKey: 2000,
    secondKey: 9800,
    thirdKey: 2290,
  },
  {
    name: "Stat 4",
    firstKey: 2780,
    secondKey: 3908,
    thirdKey: 2000,
  },
  {
    name: "Stat 5",
    firstKey: 1890,
    secondKey: 4800,
    thirdKey: 2181,
  },
  {
    name: "Stat 6",
    firstKey: 2390,
    secondKey: 3800,
    thirdKey: 2500,
  },
  {
    name: "Stat 7",
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
    controls: { exclude: ["className"] },
  },
  args: {
    data: chartData,
  },
  argTypes: {},
};

export default meta;

export const Default: Story = {
  render: (props) => (
    <CartesianChart {...props} height="70vh">
      <CartesianGrid />
      <Area dataKey="firstKey" />
      <Area dataKey="secondKey" color="palatinate-blue" />
      <Area dataKey="thirdKey" color="#555" />
      <XAxis dataKey="name" />
      <YAxis interval="equidistantPreserveStart" />
      <ChartTooltip />
      <ChartLegend />
    </CartesianChart>
  ),
};

export const MultipleSynced: Story = {
  render: (props) => (
    <>
      <CartesianChart {...props} height="250px" syncId="syncedCharts">
        <CartesianGrid />
        <Area dataKey="firstKey" />
        <Area dataKey="secondKey" color="palatinate-blue" />
        <Area dataKey="thirdKey" color="tangerine" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip />
        <ChartLegend />
      </CartesianChart>
      <CartesianChart {...props} height="250px" syncId="syncedCharts">
        <CartesianGrid />
        <Area dataKey="firstKey" color="magenta" />
        <Area dataKey="secondKey" color="tropical-indigo" />
        <Area dataKey="thirdKey" color="malachite" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip />
        <ChartLegend />
      </CartesianChart>
    </>
  ),
};

export const WithEmptyView: Story = {
  render: () => {
    const emptyView = () => (
      <IllustratedMessage>
        <IconMonitoring />
        <Heading>Keine Daten verfügbar</Heading>
      </IllustratedMessage>
    );

    return (
      <CartesianChart emptyView={emptyView} height="70vh">
        <CartesianGrid />
        <Area dataKey="firstKey" />
        <Area dataKey="secondKey" color="palatinate-blue" />
        <Area dataKey="thirdKey" color="tangerine" />
        <XAxis dataKey="name" />
        <YAxis interval="equidistantPreserveStart" />
        <ChartTooltip />
        <ChartLegend />
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
  render: (props) => (
    <CartesianChart {...props} height="70vh">
      <CartesianGrid />
      <Area dataKey="mean" unit="ms" />
      <Line dataKey="max" color="magenta" unit="ms" />
      <XAxis dataKey="time" />
      <YAxis interval="equidistantPreserveStart" unit="%" domain={[0, 100]} />
      <ChartTooltip
        headingFormatter={(v) => {
          return `Sync Format: ${v}`;
        }}
        formatter={async (value, name, index, unit) => {
          await sleep(3000);
          return `Async Format: ${name}: ${value}${unit ? ` ${unit}` : ""}`;
        }}
      />
      <ChartLegend />
    </CartesianChart>
  ),
};
