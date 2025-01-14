import Section from "@mittwald/flow-react-components/Section";
import Heading from "@mittwald/flow-react-components/Heading";
import Switch from "@mittwald/flow-react-components/Switch";
import Header from "@mittwald/flow-react-components/Header";
import Text from "@mittwald/flow-react-components/Text";
import ColumnLayout from "@mittwald/flow-react-components/ColumnLayout";
import TextField from "@mittwald/flow-react-components/TextField";
import Label from "@mittwald/flow-react-components/Label";
import LabeledValue from "@mittwald/flow-react-components/LabeledValue";

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
