import {
  typedCartesianChart,
  Heading,
  Section,
} from "@mittwald/flow-react-components";

export default () => {
  const data = [
    {
      Datum: "1.9.2025",
      "Projekt A": 1256,
      "Projekt B": 345,
      "Projekt C": 467,
    },
    {
      Datum: "2.9.2025",
      "Projekt A": 1342,
      "Projekt B": 876,
      "Projekt C": 45,
    },
    {
      Datum: "3.9.2025",
      "Projekt A": 342,
      "Projekt B": 576,
      "Projekt C": 123,
    },
  ];

  const CartesianChart = typedCartesianChart<{
    Datum: string;
    "Projekt A": number;
    "Projekt B": number;
    "Projekt C": number;
  }>();

  return (
    <Section>
      <Heading>Besucher</Heading>
      <CartesianChart.Chart data={data} height="300px">
        <CartesianChart.Line dataKey="Projekt A" />
        <CartesianChart.Line
          dataKey="Projekt B"
          color="palatinate-blue"
        />
        <CartesianChart.Line
          dataKey="Projekt C"
          color="tangerine"
        />
        <CartesianChart.XAxis dataKey="Datum" />
        <CartesianChart.YAxis />
        <CartesianChart.Grid />
        <CartesianChart.Legend />
        <CartesianChart.Tooltip
          formatter={(v, k) => `${k} (${v} Besucher)`}
        />
      </CartesianChart.Chart>
    </Section>
  );
};
