import {
  typedCartesianChart,
  Heading,
  Section,
} from "@mittwald/flow-react-components";

export default () => {
  const data = [
    {
      Monat: "Juli",
      Datenbanken: 10,
      Webspace: 15.4,
      Email: 5.1,
    },
    {
      Monat: "August",
      Datenbanken: 32.9,
      Webspace: 25.6,
      Email: 10,
    },
    {
      Monat: "September",
      Datenbanken: 40,
      Webspace: 20.2,
      Email: 8,
    },
  ];

  const CartesianChart = typedCartesianChart<{
    Monat: string;
    Datenbanken: number;
    Webspace: number;
    Email: number;
  }>();

  return (
    <Section>
      <Heading>Speicherplatz</Heading>
      <CartesianChart.Chart data={data} height="300px">
        <CartesianChart.Bar
          dataKey="Datenbanken"
          unit="GB"
        />
        <CartesianChart.Bar
          dataKey="Webspace"
          color="palatinate-blue"
          unit="GB"
        />
        <CartesianChart.Bar
          dataKey="Email"
          color="tangerine"
          unit="GB"
        />
        <CartesianChart.XAxis dataKey="Monat" />
        <CartesianChart.YAxis unit=" GB" />
        <CartesianChart.Grid />
        <CartesianChart.Legend />
        <CartesianChart.Tooltip />
      </CartesianChart.Chart>
    </Section>
  );
};
