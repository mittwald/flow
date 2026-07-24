import {
  Alert,
  AlertIcon,
  Heading,
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components";

<Tabs>
  <Tab>
    <TabTitle>Allgemein</TabTitle>
    Allgemeiner Inhalt
  </Tab>
  <Tab id="storage">
    <TabTitle>
      Speicherplatz
      <AlertIcon status="danger" />
    </TabTitle>
    <Alert status="danger">
      <Heading>Dein Speicherplatz ist voll</Heading>
    </Alert>
  </Tab>
  <Tab>
    <TabTitle>Spamschutz</TabTitle>
    Spamschutz Inhalt
  </Tab>
</Tabs>;
