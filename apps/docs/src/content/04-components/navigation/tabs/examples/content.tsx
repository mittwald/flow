import {
  Header,
  Heading,
  Label,
  LabeledValue,
  Section,
  Switch,
  Tab,
  Tabs,
  TabTitle,
  Text,
  TextField,
} from "@mittwald/flow-react-components";

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
