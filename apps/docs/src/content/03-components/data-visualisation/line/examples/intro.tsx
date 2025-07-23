import {
  Line,
  AreaChart,
} from "@mittwald/flow-react-components";

<AreaChart
  height="150px"
  data={[
    {
      name: "Stat 1",
      firstKey: 4000,
    },
    {
      name: "Stat 2",
      firstKey: 3000,
    },
    {
      name: "Stat 3",
      firstKey: 2000,
    },
    {
      name: "Stat 4",
      firstKey: 2780,
    },
    {
      name: "Stat 5",
      firstKey: 1890,
    },
    {
      name: "Stat 6",
      firstKey: 2390,
    },
    {
      name: "Stat 7",
      firstKey: 3490,
    },
  ]}
>
  <Line dataKey="firstKey" />
</AreaChart>;
