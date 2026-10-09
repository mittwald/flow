import {
  Accordion,
  AlertBadge,
  Badge,
  Content,
  Heading,
  Text,
} from "@mittwald/flow-react-components";

<Accordion>
  <Heading>
    Rechnungen
    <Badge>3 offen</Badge>
    <AlertBadge status="warning">Überfällig</AlertBadge>
  </Heading>
  <Content>
    <Text>Deine Rechnungen der letzten zwölf Monate.</Text>
  </Content>
</Accordion>;
