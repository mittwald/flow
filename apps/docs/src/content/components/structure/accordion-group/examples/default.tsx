import {
  Accordion,
  AccordionGroup,
  Content,
  Heading,
  Text,
} from "@mittwald/flow-react-components";

<AccordionGroup>
  <Accordion>
    <Heading>Rechnungen</Heading>
    <Content>
      <Text>
        Deine Rechnungen der letzten zwölf Monate.
      </Text>
    </Content>
  </Accordion>
  <Accordion>
    <Heading>Verträge</Heading>
    <Content>
      <Text>Alle aktiven und gekündigten Verträge.</Text>
    </Content>
  </Accordion>
  <Accordion>
    <Heading>Zahlungsart</Heading>
    <Content>
      <Text>
        Lastschrift vom Konto mit der Endung 1234.
      </Text>
    </Content>
  </Accordion>
</AccordionGroup>;
