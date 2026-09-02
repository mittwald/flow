import {
  Badge,
  ColumnLayout,
  Text,
} from "@mittwald/flow-react-components";

<ColumnLayout m={[1, 1, 1]}>
  <Text>
    <Badge color="teal">Context</Badge>
    Einordnung <br />
    <small>z. B. Farbe, Component</small>
  </Text>
  <Text>
    <Badge color="orange">Common Unit</Badge>
    Kategorie <br />
    <small>z. B. Variante, Sizing, Styling</small>
  </Text>
  <Text>
    <Badge color="lilac">Clarification</Badge>
    Spezifizierung <br />
    <small>z. B. Farbwert, State</small>
  </Text>
</ColumnLayout>;
