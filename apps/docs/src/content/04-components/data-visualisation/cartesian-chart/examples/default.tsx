import {
  Area,
  CartesianChart,
  CartesianGrid,
  ChartTooltip,
  ChartLegend,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";

<CartesianChart
  data={[
    {
      Zeit: "0 Uhr",
      Datenbanken: 40,
      Projekte: 24,
    },
    {
      Zeit: "1 Uhr",
      Datenbanken: 30,
      Projekte: 13,
    },
    {
      Zeit: "2 Uhr",
      Datenbanken: 20,
      Projekte: 78,
    },
    {
      Zeit: "3 Uhr",
      Datenbanken: 27,
      Projekte: 39,
    },
  ]}
  height="300px"
>
  <CartesianGrid />
  <Area dataKey="Datenbanken" />
  <Area dataKey="Projekte" color="palatinate-blue" />
  <XAxis dataKey="Zeit" />
  <YAxis domain={[0, 100]} unit=" %" />
  <ChartTooltip formatter={(v, k) => `${k}: ${v} %`} />
  <ChartLegend />
</CartesianChart>;
