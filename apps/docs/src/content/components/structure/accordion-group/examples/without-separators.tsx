import {
  Accordion,
  AccordionGroup,
  Content,
  Text,
} from "@mittwald/flow-react-components";

<AccordionGroup separators={false}>
  <Accordion>
    <Text>Erweiterte Einstellungen</Text>
    <Content>
      <Text>
        Einstellungen, die die meisten Projekte nicht
        benötigen.
      </Text>
    </Content>
  </Accordion>
  <Accordion>
    <Text>Experimentelle Funktionen</Text>
    <Content>
      <Text>Funktionen, die sich noch ändern können.</Text>
    </Content>
  </Accordion>
</AccordionGroup>;
