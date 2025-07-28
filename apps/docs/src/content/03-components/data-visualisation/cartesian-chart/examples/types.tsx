import {
  Area,
  Line,
  CartesianChart,
  CartesianGrid,
  ChartTooltip,
  ChartLegend,
  YAxis,
  XAxis,
} from "@mittwald/flow-react-components";

<CartesianChart
  data={[
    {
      Zeit: "0 Uhr",
      Durchschnitt: 40,
      Maximum: 45,
    },
    {
      Zeit: "1 Uhr",
      Durchschnitt: 32,
      Maximum: 35,
    },
    {
      Zeit: "2 Uhr",
      Durchschnitt: 20,
      Maximum: 78,
    },
    {
      Zeit: "3 Uhr",
      Durchschnitt: 27,
      Maximum: 39,
    },
  ]}
  height="300px"
>
  <CartesianGrid />
  <Area dataKey="Durchschnitt" />
  <Line dataKey="Maximum" color="magenta" />
  <XAxis dataKey="Zeit" />
  <YAxis domain={[0, 100]} unit=" %" />
  <ChartTooltip formatter={(v, k) => `${k}: ${v} %`} />
  <ChartLegend />
</CartesianChart>;
