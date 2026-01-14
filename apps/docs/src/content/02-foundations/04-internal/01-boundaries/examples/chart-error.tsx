import {
  AlertIcon,
  CartesianChart,
  IllustratedMessage,
  Heading,
  Text,
  XAxis,
  YAxis,
} from "@mittwald/flow-react-components";

<CartesianChart
  height="300px"
  emptyView={() => (
    <IllustratedMessage color="danger">
      <AlertIcon status="danger" />
      <Heading>Fehler beim Laden </Heading>
      <Text>
        Dieser Bereich konnte nicht geladen werden. Wir
        arbeiten daran das Problem zu beheben.
      </Text>
    </IllustratedMessage>
  )}
>
  <XAxis />
  <YAxis domain={[0, 100]} unit=" %" />
</CartesianChart>;
