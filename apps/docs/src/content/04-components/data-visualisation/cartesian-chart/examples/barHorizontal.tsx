import {
  typedCartesianChart,
  Heading,
  Section,
} from "@mittwald/flow-react-components";

export default () => {
  const data = [
    { Projekt: "Projekt A", Speicherplatz: 68 },
    { Projekt: "Projekt B", Speicherplatz: 42 },
    { Projekt: "Projekt C", Speicherplatz: 21 },
  ];

  const CartesianChart = typedCartesianChart<{
    Projekt: string;
    Speicherplatz: number;
  }>();

  return (
    <Section>
      <Heading>Speicherplatz pro Projekt</Heading>
      <CartesianChart.Chart
        data={data}
        height="300px"
        layout="vertical"
      >
        <CartesianChart.Bar
          dataKey="Speicherplatz"
          unit="GB"
        />
        <CartesianChart.XAxis type="number" unit=" GB" />
        <CartesianChart.YAxis
          type="category"
          dataKey="Projekt"
        />
        <CartesianChart.Grid vertical horizontal={false} />
        <CartesianChart.Tooltip />
      </CartesianChart.Chart>
    </Section>
  );
};
