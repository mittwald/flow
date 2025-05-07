import {
  Area,
  AreaChart,
  CartesianGrid,
  ChartTooltip,
  Legend,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";

<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }}
>
  <AreaChart
    data={[
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
    ]}
    height="250px"
    syncId="syncedAreaCharts"
  >
    <CartesianGrid />
    <Area dataKey="firstKey" />
    <Area dataKey="secondKey" color="palatinate-blue" />
    <Area dataKey="thirdKey" color="tangerine" />
    <XAxis dataKey="name" />
    <YAxis interval="preserveStartEnd" />
    <ChartTooltip />
    <Legend />
  </AreaChart>
  <AreaChart
    data={[
      {
        name: "Stat 4",
        firstKey: 1790,
        secondKey: 1780,
        thirdKey: 1500,
      },
      {
        name: "Stat 5",
        firstKey: 1890,
        secondKey: 4800,
        thirdKey: 2181,
      },
      {
        name: "Stat 6",
        firstKey: 2100,
        secondKey: 3200,
        thirdKey: 1900,
      },
    ]}
    height="250px"
    syncId="syncedAreaCharts"
  >
    <CartesianGrid />
    <Area dataKey="firstKey" color="magenta" />
    <Area dataKey="secondKey" color="tropical-indigo" />
    <Area dataKey="thirdKey" color="malachite" />
    <XAxis dataKey="name" />
    <YAxis interval="preserveStartEnd" />
    <ChartTooltip />
    <Legend />
  </AreaChart>
</div>;
