import {
  Tab,
  TabTitle,
  Tabs,
} from "@mittwald/flow-react-components/Tabs";
import { Section } from "@mittwald/flow-react-components/Section";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { TextField } from "@mittwald/flow-react-components/TextField";
import { Label } from "@mittwald/flow-react-components/Label";
import { LabeledValue } from "@mittwald/flow-react-components/LabeledValue";
import { Text } from "@mittwald/flow-react-components/Text";
import { Header } from "@mittwald/flow-react-components/Header";
import { Switch } from "@mittwald/flow-react-components/Switch";

<Tabs>
  <Tab>
    <TabTitle>Allgemein</TabTitle>
    <Section>
      <Heading>Allgemein</Heading>
      <TextField defaultValue="example@mittwald.de">
        <Label>E-Mail-Adresse</Label>
      </TextField>
    </Section>
  </Tab>
  <Tab id="storage">
    <TabTitle>Speicherplatz</TabTitle>
    <Section>
      <Heading>Speicherplatz</Heading>
      <LabeledValue>
        <Label>Verfügbarer Speicherplatz</Label>
        <Text>2.4 GB</Text>
      </LabeledValue>
    </Section>
  </Tab>
  <Tab>
    <TabTitle>Spamschutz</TabTitle>
    <Section>
      <Header>
        <Heading>Spamschutz</Heading>
        <Switch>Spamschutz</Switch>
      </Header>
      <Text>
        Der Spamfilter schützt dich vor ungewollten E-Mails.
        Niemand will Müll in seinem Postfach, daher
        empfehlen wir den Spamschutz immer aktiviert zu
        lassen.
      </Text>
    </Section>
  </Tab>
</Tabs>;
