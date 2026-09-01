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

  return (
    <Flex direction="row" grow>
      <CartesianChart emptyView={emptyView}>
        <XAxis />
        <YAxis />
      </CartesianChart>
    </Flex>
  );
};
