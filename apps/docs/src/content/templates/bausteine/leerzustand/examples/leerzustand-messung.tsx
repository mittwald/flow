import {
  Heading,
  IconTime,
  IllustratedMessage,
  LayoutCard,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <IllustratedMessage>
      <IconTime />
      <Heading>Noch keine Messung vorhanden</Heading>
      <Text>
        Wir messen <b>regelmäßig</b> die Domains deines
        Projekts. Sobald du Domains mit hinterlegter Website
        angelegt hast, werden <b>nach wenigen</b> Tagen
        erste Messergebnisse auftauchen.
      </Text>
    </IllustratedMessage>
  </LayoutCard>
);
