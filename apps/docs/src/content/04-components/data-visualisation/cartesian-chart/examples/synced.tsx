import {
  typedCartesianChart,
  Heading,
  Section,
} from "@mittwald/flow-react-components";

export default () => {
  interface ChartData {
    Zeit: string;
    Datenbanken: number;
    Projekte: number;
  }

  const CartesianChart = typedCartesianChart<ChartData>();

  return (
    <Section>
      <Heading>CPU</Heading>
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
        height="200px"
        syncId="syncedCharts"
      >
        <CartesianChart.Area
          dataKey="Datenbanken"
          unit="%"
        />
        <CartesianChart.Area
          dataKey="Projekte"
          color="palatinate-blue"
          unit="%"
        />
        <CartesianChart.XAxis dataKey="Zeit" />
        <CartesianChart.YAxis domain={[0, 100]} unit=" %" />
        <CartesianChart.Grid />
        <CartesianChart.Tooltip />
      </CartesianChart.Chart>
      <Heading>RAM</Heading>
      <CartesianChart.Chart
        data={[
          {
            Zeit: "0 Uhr",
            Datenbanken: 39,
            Projekte: 27,
          },
          {
            Zeit: "1 Uhr",
            Datenbanken: 30,
            Projekte: 13,
          },
          {
            Zeit: "2 Uhr",
            Datenbanken: 63,
            Projekte: 10,
          },
          {
            Zeit: "3 Uhr",
            Datenbanken: 24,
            Projekte: 40,
          },
        ]}
        syncId="syncedCharts"
      >
        <CartesianChart.Area
          dataKey="Datenbanken"
          unit="%"
        />
        <CartesianChart.Area
          dataKey="Projekte"
          color="palatinate-blue"
          unit="%"
        />
        <CartesianChart.XAxis dataKey="Zeit" />
        <CartesianChart.YAxis domain={[0, 100]} unit=" %" />
        <CartesianChart.Grid />
        <CartesianChart.Legend />
        <CartesianChart.Tooltip />
      </CartesianChart.Chart>
    </Section>
  );
};
