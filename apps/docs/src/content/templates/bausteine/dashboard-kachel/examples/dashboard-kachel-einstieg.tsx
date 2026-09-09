import {
  Button,
  Content,
  Header,
  Heading,
  LayoutCard,
  Section,
  Text,
} from "@mittwald/flow-react-components";

export default () => (
  <LayoutCard>
    <Section>
      <Header>
        <Heading>Erste Schritte</Heading>
      </Header>
      <Content>
        <Text>
          In diesem Projekt gibt es noch keine
          E-Mail-Adresse. Lege eine an, um unter deiner
          Domain E-Mails zu empfangen.
        </Text>
      </Content>
      <Button variant="soft" color="secondary">
        E-Mail-Adresse anlegen
      </Button>
    </Section>
  </LayoutCard>
);
