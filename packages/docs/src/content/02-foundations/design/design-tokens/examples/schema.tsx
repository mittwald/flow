import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { Text } from "@mittwald/flow-react-components/Text";
import { Badge } from "@mittwald/flow-react-components/Badge";

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
