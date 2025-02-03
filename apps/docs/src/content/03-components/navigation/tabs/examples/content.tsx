import {
  Tabs,
  Tab,
  TabTitle,
} from "@mittwald/flow-react-components";
import { Section } from "@mittwald/flow-react-components";
import { Heading } from "@mittwald/flow-react-components";
import { TextField } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { LabeledValue } from "@mittwald/flow-react-components";
import { Text } from "@mittwald/flow-react-components";
import { Header } from "@mittwald/flow-react-components";
import { Switch } from "@mittwald/flow-react-components";

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
        <Switch>Spamfilter</Switch>
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
