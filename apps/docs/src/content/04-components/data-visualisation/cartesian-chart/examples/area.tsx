import {
  Area,
  CartesianChart,
  CartesianGrid,
  ChartLegend,
  ChartTooltip,
  Heading,
  Section,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";

export default () => {
  const data = [
    {
      Datum: "1.9.2025",
      Datenbanken: 10,
      Webspace: 15,
      Email: 5,
    },
    {
      Datum: "2.9.2025",
      Datenbanken: 32,
      Webspace: 25,
      Email: 10,
    },
    {
      Datum: "3.9.2025",
      Datenbanken: 40,
      Webspace: 20,
      Email: 8,
    },
  ];

  return (
    <Section>
      <Heading>Speicherplatz</Heading>
      <CartesianChart data={data} height="300px">
        <CartesianGrid />
        <Area dataKey="Datenbanken" unit="%" />
        <Area
          dataKey="Webspace"
          color="palatinate-blue"
          unit="%"
        />
        <Area dataKey="Email" color="tangerine" unit="%" />
        <XAxis dataKey="Datum" />
        <YAxis domain={[0, 100]} unit=" %" />
        <ChartLegend />
        <ChartTooltip />
      </CartesianChart>
    </Section>
  );
};
