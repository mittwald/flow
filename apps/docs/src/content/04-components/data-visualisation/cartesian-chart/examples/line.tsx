import {
  CartesianChart,
  CartesianGrid,
  ChartLegend,
  ChartTooltip,
  Heading,
  Line,
  Section,
  XAxis,
  YAxis,
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

  return (
    <Section>
      <Heading>Besucher</Heading>
      <CartesianChart data={data} height="300px">
        <CartesianGrid />
        <Line dataKey="Projekt A" />
        <Line dataKey="Projekt B" color="palatinate-blue" />
        <Line dataKey="Projekt C" color="tangerine" />
        <XAxis dataKey="Datum" />
        <YAxis />
        <ChartLegend />
        <ChartTooltip />
      </CartesianChart>
    </Section>
  );
};
