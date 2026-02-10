import {
  CartesianChart,
  Flex,
  Heading,
  IconMonitoring,
  IllustratedMessage,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";

export default () => {
  const emptyView = (
    <IllustratedMessage>
      <IconMonitoring />
      <Heading>Keine Daten verfügbar</Heading>
    </IllustratedMessage>
  );

  const Chart = () => {
    return (
      <CartesianChart
        emptyView={emptyView}
        height="300px"
        flexGrow
        {...props}
      >
        <XAxis />
        <YAxis />
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
