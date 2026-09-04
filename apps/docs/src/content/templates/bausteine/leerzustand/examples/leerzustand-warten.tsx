import {
  Heading,
  IconEmail,
  IllustratedMessage,
  LayoutCard,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <IllustratedMessage>
      <IconEmail />
      <Heading>E-Mail-Adresse wird eingerichtet</Heading>
      <Text>
        Die Adresse max@mustermann.de wird gerade angelegt.
        Sobald die MX-Records der Domain übernommen sind,
        kann sie E-Mails empfangen – das dauert in der Regel
        wenige Minuten.
      </Text>
    </IllustratedMessage>
  </LayoutCard>
);
