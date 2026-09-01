import {
  Flex,
  Heading,
  IconDanger,
  IllustratedMessage,
  LayoutCard,
  Text,
} from "@mittwald/flow-react-components";

export default () => {
  return (
    <Flex direction="column" gap="m">
      <Heading level={1} color="dark">
        Mein Projekt
      </Heading>

      <LayoutCard>
        <IllustratedMessage color="danger">
          <IconDanger />
          <Heading>Fehler beim Laden von Daten</Heading>
          <Text>
            Dieser Bereich konnte nicht geladen werden. Wir
            arbeiten daran das Problem zu beheben. Bitte
            habe etwas Geduld und probiere es später noch
            einmal.
          </Text>
        </IllustratedMessage>
      </LayoutCard>
    </Flex>
  );
};
