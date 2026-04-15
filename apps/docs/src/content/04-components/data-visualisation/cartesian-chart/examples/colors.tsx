import { typedCartesianChart } from "@mittwald/flow-react-components";

export default () => {
  const CartesianChart = typedCartesianChart<{
    Zeit: string;
    Datenbanken: number;
    Projekte: number;
  }>();

  return (
    <CartesianChart.Chart
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
      <CartesianChart.Area
        dataKey="Datenbanken"
        color="lime"
        unit="%"
      />
      <CartesianChart.Area
        dataKey="Projekte"
        color="#555"
        unit="%"
      />
      <CartesianChart.XAxis dataKey="Zeit" />
      <CartesianChart.YAxis domain={[0, 100]} unit=" %" />
      <CartesianChart.Grid />
      <CartesianChart.Legend />
      <CartesianChart.Tooltip />
    </CartesianChart.Chart>
  );
};
