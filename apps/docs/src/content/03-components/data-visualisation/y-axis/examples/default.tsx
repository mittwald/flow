import {
  Area,
  AreaChart,
  YAxis,
} from "@mittwald/flow-react-components";

<div style={{ height: "300px" }}>
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
    ]}
  >
    <Area dataKey="firstKey" />
    <Area dataKey="secondKey" color="palatinate-blue" />
    <Area dataKey="thirdKey" color="tangerine" />
    <YAxis />
  </AreaChart>
</div>;
