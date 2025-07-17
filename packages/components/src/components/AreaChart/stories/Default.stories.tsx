import type { Meta, StoryObj } from "@storybook/react";
import AreaChart from "../AreaChart";
import Area from "../components/Area";
import ChartTooltip from "@/components/ChartTooltip";
import CartesianGrid from "@/components/CartesianGrid";
import XAxis from "@/components/XAxis";
import YAxis from "@/components/YAxis";
import ChartLegend from "@/components/ChartLegend";
import IllustratedMessage from "@/components/IllustratedMessage";
import { Heading, IconMonitoring } from "@/components/public";
import { Line } from "@/components/AreaChart/components/Line";

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

type Story = StoryObj<typeof AreaChart>;

const meta: Meta<typeof AreaChart> = {
  title: "Data Visualisation/AreaChart",
  component: AreaChart,
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
    <AreaChart {...props} height="70vh">
      <CartesianGrid />
      <Area dataKey="firstKey" />
      <Area dataKey="secondKey" color="palatinate-blue" />
      <Area dataKey="thirdKey" color="tangerine" />
      <XAxis dataKey="name" />
      <YAxis interval="equidistantPreserveStart" />
      <ChartTooltip />
      <ChartLegend />
    </AreaChart>
  ),
};

export const MultipleSynced: Story = {
  render: (props) => (
    <>
      <AreaChart {...props} height="250px" syncId="syncedAreaCharts">
        <CartesianGrid />
        <Area dataKey="firstKey" />
        <Area dataKey="secondKey" color="palatinate-blue" />
        <Area dataKey="thirdKey" color="tangerine" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip />
        <ChartLegend />
      </AreaChart>
      <AreaChart {...props} height="250px" syncId="syncedAreaCharts">
        <CartesianGrid />
        <Area dataKey="firstKey" color="magenta" />
        <Area dataKey="secondKey" color="tropical-indigo" />
        <Area dataKey="thirdKey" color="malachite" />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip />
        <ChartLegend />
      </AreaChart>
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
      <AreaChart emptyView={emptyView} height="70vh">
        <CartesianGrid />
        <Area dataKey="firstKey" />
        <Area dataKey="secondKey" color="palatinate-blue" />
        <Area dataKey="thirdKey" color="tangerine" />
        <XAxis dataKey="name" />
        <YAxis interval="equidistantPreserveStart" />
        <ChartTooltip />
        <ChartLegend />
      </AreaChart>
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
    <AreaChart {...props} height="70vh">
      <CartesianGrid />
      <Area dataKey="mean" />
      <Line dataKey="max" color="magenta" />
      <XAxis dataKey="time" />
      <YAxis interval="equidistantPreserveStart" unit="%" domain={[0, 100]} />
      <ChartTooltip />
      <ChartLegend />
    </AreaChart>
  ),
};
