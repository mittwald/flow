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
    ab: 4000,
    cd: 2400,
    ef: 2400,
  },
  {
    name: "Stat 2",
    ab: 3000,
    cd: 1398,
    ef: 2210,
  },
  {
    name: "Stat 3",
    ab: 2000,
    cd: 9800,
    ef: 2290,
  },
  {
    name: "Stat 4",
    ab: 2780,
    cd: 3908,
    ef: 2000,
  },
  {
    name: "Stat 5",
    ab: 1890,
    cd: 4800,
    ef: 2181,
  },
  {
    name: "Stat 6",
    ab: 2390,
    cd: 3800,
    ef: 2500,
  },
  {
    name: "Stat 7",
    ab: 3490,
    cd: 4300,
    ef: 2100,
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
        <Area dataKey="ab" />
        <Area dataKey="cd" color="palatinate-blue" />
        <Area dataKey="ef" color="tangerine" />
        <XAxis dataKey="name" />
        <YAxis />
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
          <Area dataKey="ab" />
          <Area dataKey="cd" color="palatinate-blue" />
          <Area dataKey="ef" color="tangerine" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip />
          <Legend />
        </AreaChart>
      </div>
      <div style={{ height: "250px" }}>
        <AreaChart {...props} syncId="syncedAreaCharts">
          <CartesianGrid />
          <Area dataKey="ab" color="magenta" />
          <Area dataKey="cd" color="tropical-indigo" />
          <Area dataKey="ef" color="malachite" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip />
          <Legend />
        </AreaChart>
      </div>
    </>
  ),
};
