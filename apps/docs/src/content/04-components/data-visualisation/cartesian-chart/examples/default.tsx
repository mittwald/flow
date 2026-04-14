import { typedCartesianChart } from "@mittwald/flow-react-components";

export default () => {
  const CartesianChart = typedCartesianChart<{
    Zeit: string;
    Datenbanken: number;
    Projekte: number;
  }>();

  return (
    <CartesianChart.CartesianChart
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
    >
      <CartesianChart.Area dataKey="Datenbanken" unit="%" />
      <CartesianChart.Area
        dataKey="Projekte"
        color="palatinate-blue"
        unit="%"
      />
      <CartesianChart.XAxis dataKey="Zeit" />
      <CartesianChart.YAxis domain={[0, 100]} unit=" %" />
      <CartesianChart.ChartGrid />
      <CartesianChart.ChartLegend />
      <CartesianChart.ChartTooltip />
    </CartesianChart.CartesianChart>
  );
};
