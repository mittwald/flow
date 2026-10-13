import {
  Accordion,
  AccordionGroup,
  Content,
  Heading,
  Text,
} from "@mittwald/flow-react-components";

<AccordionGroup allowsMultipleExpanded={false}>
  <Accordion defaultExpanded>
    <Heading>Schritt 1: Domain registrieren</Heading>
    <Content>
      <Text>
        Wähle eine freie Domain und registriere sie.
      </Text>
    </Content>
  </Accordion>
  <Accordion>
    <Heading>Schritt 2: DNS einrichten</Heading>
    <Content>
      <Text>Verbinde die Domain mit deinem Projekt.</Text>
    </Content>
  </Accordion>
  <Accordion>
    <Heading>Schritt 3: Zertifikat ausstellen</Heading>
    <Content>
      <Text>
        Sichere die Domain mit einem TLS-Zertifikat ab.
      </Text>
    </Content>
  </Accordion>
</AccordionGroup>;
