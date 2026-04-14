import {
  Heading,
  Section,
  typedCartesianChart,
} from "@mittwald/flow-react-components";

export default () => {
  const data = [
    {
      Datum: "1.9.2025",
      Datenbanken: 10,
      Webspace: 15.4,
      Email: 5.1,
    },
    {
      Datum: "2.9.2025",
      Datenbanken: 32.9,
      Webspace: 25.6,
      Email: 10,
    },
    {
      Datum: "3.9.2025",
      Datenbanken: 40,
      Webspace: 20.2,
      Email: 8,
    },
  ];

  const CartesianChart = typedCartesianChart<{
    Datum: string;
    Datenbanken: number;
    Webspace: number;
    Email: number;
  }>();

  return (
    <Section>
      <Heading>Speicherplatz</Heading>
      <CartesianChart.CartesianChart
        data={data}
        height="300px"
      >
        <CartesianChart.Area
          dataKey="Datenbanken"
          unit="%"
        />
        <CartesianChart.Area
          dataKey="Webspace"
          color="palatinate-blue"
          unit="%"
        />
        <CartesianChart.Area
          dataKey="Email"
          color="tangerine"
          unit="%"
        />
        <CartesianChart.XAxis dataKey="Datum" />
        <CartesianChart.YAxis domain={[0, 100]} unit=" %" />
        <CartesianChart.ChartGrid />
        <CartesianChart.ChartLegend />
        <CartesianChart.ChartTooltip
          formatter={(value, name) =>
            `${name}: ${Intl.NumberFormat(undefined, {
              style: "unit",
              unit: "gigabyte",
            }).format(
              typeof value === "number" ? value : 0,
            )}`
          }
          progressBarFormatter={(value) =>
            Intl.NumberFormat(undefined, {
              style: "unit",
              unit: "gigabyte",
            }).format(typeof value === "number" ? value : 0)
          }
        />
      </CartesianChart.CartesianChart>
    </Section>
  );
};
