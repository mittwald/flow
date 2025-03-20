import type { Meta, StoryObj } from "@storybook/react";
import AreaChart from "../AreaChart";
import Area from "../components/Area";
import ChartTooltip from "@/components/ChartTooltip";
import CartesianGrid from "@/components/CartesianGrid";
import XAxis from "@/components/XAxis";
import YAxis from "@/components/YAxis";
import Legend from "@/components/Legend";

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
    <div style={{ height: "70vh" }}>
      <AreaChart {...props}>
        <CartesianGrid />
        <Area dataKey="firstKey" />
        <Area dataKey="secondKey" color="palatinate-blue" />
        <Area dataKey="thirdKey" color="tangerine" />
        <XAxis dataKey="name" />
        <YAxis interval="equidistantPreserveStart" />
        <ChartTooltip />
        <Legend />
      </AreaChart>
    </div>
  ),
};

export const MultipleSynced: Story = {
  render: (props) => (
    <>
      <div style={{ height: "250px" }}>
        <AreaChart {...props} syncId="syncedAreaCharts">
          <CartesianGrid />
          <Area dataKey="firstKey" />
          <Area dataKey="secondKey" color="palatinate-blue" />
          <Area dataKey="thirdKey" color="tangerine" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip />
          <Legend />
        </AreaChart>
      </div>
      <div style={{ height: "250px" }}>
        <AreaChart {...props} syncId="syncedAreaCharts">
          <CartesianGrid />
          <Area dataKey="firstKey" color="magenta" />
          <Area dataKey="secondKey" color="tropical-indigo" />
          <Area dataKey="thirdKey" color="malachite" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip />
          <Legend />
        </AreaChart>
      </div>
    </>
  ),
};
