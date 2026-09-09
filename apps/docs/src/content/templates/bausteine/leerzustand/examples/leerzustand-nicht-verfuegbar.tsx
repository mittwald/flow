import {
  Button,
  Heading,
  IconMinus,
  IllustratedMessage,
  LayoutCard,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <IllustratedMessage>
      <IconMinus />
      <Heading>Container Hosting nicht verfügbar</Heading>
      <Text>
        Container Hosting steht in diesem Projekt nicht zur
        Verfügung. Mit einem vServer oder Dedicated Server
        kannst du Container Hosting nutzen.
      </Text>
      <Button variant="soft" color="secondary">
        Zur Startseite
      </Button>
    </IllustratedMessage>
  </LayoutCard>
);
