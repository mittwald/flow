import {
  CartesianChart,
  type CartesianChartEmptyViewProps,
  CartesianGrid,
  Flex,
  Heading,
  IconDanger,
  IconMonitoring,
  IllustratedMessage,
  Link,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";

export default () => {
  const EmptyView = (
    props: CartesianChartEmptyViewProps,
  ) => {
    if (props.data === undefined) {
      return (
        <IllustratedMessage color="danger">
          <IconDanger />
          <Heading>Laden der Daten fehlgeschlagen</Heading>
          <Link>Neu laden</Link>
        </IllustratedMessage>
      );
    }

    return (
      <IllustratedMessage>
        <IconMonitoring />
        <Heading>Keine Daten verfügbar</Heading>
      </IllustratedMessage>
    );
  };

  const Chart = (props: CartesianChartEmptyViewProps) => {
    return (
      <CartesianChart
        emptyView={EmptyView}
        height="300px"
        flexGrow
        {...props}
      >
        <CartesianGrid />
        <XAxis dataKey="Zeit" />
        <YAxis domain={[0, 100]} unit=" %" />
      </CartesianChart>
    );
  };

  return (
    <Flex direction="row" grow>
      <Chart />
      <Chart data={[]} />
    </Flex>
  );
};
