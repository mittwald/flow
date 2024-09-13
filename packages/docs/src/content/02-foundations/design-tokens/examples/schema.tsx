import { ColumnLayout } from "@mittwald/flow-react-components/ColumnLayout";
import { StatusBadge } from "@mittwald/flow-react-components/StatusBadge";
import { Text } from "@mittwald/flow-react-components/Text";

<ColumnLayout m={[1, 1, 1]}>
  <Text>
    <StatusBadge>Context</StatusBadge>
    Einordnung <br />
    <small>z. B. Farbe, Component</small>
  </Text>
  <Text>
    <StatusBadge status="warning">Common Unit</StatusBadge>
    Kategorie <br />
    <small>z. B. Variante, Sizing, Styling</small>
  </Text>
  <Text>
    <StatusBadge>Clarification</StatusBadge>
    Spezifizierung
    <br />
    <small>z. B. Farbwert, State</small>
  </Text>
</ColumnLayout>;
