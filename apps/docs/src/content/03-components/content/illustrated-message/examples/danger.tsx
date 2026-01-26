import {
  Button,
  Heading,
  IconDanger,
  IllustratedMessage,
  Text,
} from "@mittwald/flow-react-components";

<IllustratedMessage color="danger">
  <IconDanger />
  <Heading>Fehler beim Laden von Daten</Heading>
  <Text>
    Dieser Bereich konnte nicht geladen werden. Wir arbeiten
    daran das Problem zu beheben. Bitte habe etwas Geduld
    und probiere es später noch einmal.
  </Text>
  <Button color="secondary" variant="soft">
    Erneut versuchen
  </Button>
</IllustratedMessage>;
