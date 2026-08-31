import {
  AlertIcon,
  LayoutCard,
  Heading,
  Text,
  IllustratedMessage,
} from "@mittwald/flow-react-components";

<LayoutCard style={{ minWidth: 300 }}>
  <IllustratedMessage color="danger">
    <AlertIcon status="danger" />
    <Heading>Fehler beim Laden</Heading>
    <Text>
      Dieser Bereich konnte nicht geladen werden. Wir
      arbeiten daran das Problem zu beheben.
    </Text>
  </IllustratedMessage>
</LayoutCard>;
