import {
  Area,
  AreaChart,
  CartesianGrid,
} from "@mittwald/flow-react-components";

<AreaChart
  height="150px"
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
      firstKey: 6000,
      secondKey: 6500,
    },
  ]}
>
  <Area dataKey="firstKey" />
  <Area dataKey="secondKey" color="palatinate-blue" />
  <CartesianGrid />
</AreaChart>;
