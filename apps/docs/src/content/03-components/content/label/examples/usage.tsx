import {
  ColumnLayout,
  Header,
  Heading,
  Label,
  LabeledValue,
  Section,
  Switch,
  Text,
  TextField,
} from "@mittwald/flow-react-components";

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
