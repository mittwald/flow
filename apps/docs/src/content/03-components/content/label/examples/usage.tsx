import { Section } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { Switch } from "@mittwald/flow-react-components";
import { Header } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { ColumnLayout } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { LabeledValue } from "@mittwald/flow-react-components";

<Section>
  <Header>
    <Heading>Cronjob</Heading>
    <Switch>Aktiviert</Switch>
  </Header>
  <ColumnLayout l={[1, 1]}>
    <TextField>
      <Label>Beschreibung</Label>
    </TextField>
    <LabeledValue>
      <Label>Nächste Ausführung</Label>
      <Text>10.06.2024 um 09:25 Uhr</Text>
    </LabeledValue>
  </ColumnLayout>
</Section>;
