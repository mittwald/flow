import {
  Area,
  AreaChart,
  XAxis,
} from "@mittwald/flow-react-components";

<AreaChart
  height="150px"
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
  <Area dataKey="firstKey" />
  <Area dataKey="secondKey" color="palatinate-blue" />
  <Area dataKey="thirdKey" color="tangerine" />
  <XAxis dataKey="name" />
</AreaChart>;
