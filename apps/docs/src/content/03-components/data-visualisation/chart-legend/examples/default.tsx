import {
  Area,
  AreaChart,
  ChartLegend,
} from "@mittwald/flow-react-components";

<div style={{ height: "300px" }}>
  <AreaChart
    data={[
      {
        name: "Stat 1",
        firstKey: 4000,
        secondKey: 4500,
      },
      {
        name: "Stat 2",
        firstKey: 3000,
        secondKey: 3500,
      },
      {
        name: "Stat 3",
        firstKey: 2000,
        secondKey: 2500,
      },
      {
        name: "Stat 4",
        firstKey: 2780,
        secondKey: 2880,
      },
      {
        name: "Stat 5",
        firstKey: 1890,
        secondKey: 1990,
      },
      {
        name: "Stat 6",
        firstKey: 2390,
        secondKey: 2890,
      },
      {
        name: "Stat 7",
        firstKey: 3490,
        secondKey: 3990,
      },
    ]}
  >
    <Area dataKey="firstKey" />
    <Area dataKey="secondKey" color="palatinate-blue" />
    <ChartLegend />
  </AreaChart>
</div>;
