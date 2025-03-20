import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";

<div
  style={{
    height: "150px",
  }}
>
  <AreaChart
    data={[
      {
        name: "Stat 1",
        firstKey: 3000,
        secondKey: 1398,
        thirdKey: 2210,
      },
      {
        name: "Stat 2",
        firstKey: 2000,
        secondKey: 9800,
        thirdKey: 2290,
      },
      {
        name: "Stat 3",
        firstKey: 2780,
        secondKey: 3908,
        thirdKey: 2000,
      },
    ]}
  >
    <CartesianGrid />
    <Area dataKey="firstKey" />
    <Area dataKey="secondKey" color="palatinate-blue" />
    <Area dataKey="thirdKey" color="tangerine" />
    <XAxis dataKey="name" />
    <YAxis />
  </AreaChart>
</div>;
