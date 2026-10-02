import {
  typedCartesianChart,
  Heading,
  Section,
} from "@mittwald/flow-react-components";

export default () => {
  const data = [
    { Projekt: "Shop", Speicherplatz: 68 },
    { Projekt: "Blog", Speicherplatz: 42 },
    { Projekt: "Wiki", Speicherplatz: 21 },
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
        <CartesianChart.XAxis unit=" GB" />
        <CartesianChart.YAxis dataKey="Projekt" />
        <CartesianChart.Grid vertical horizontal={false} />
        <CartesianChart.Tooltip />
      </CartesianChart.Chart>
    </Section>
  );
};
