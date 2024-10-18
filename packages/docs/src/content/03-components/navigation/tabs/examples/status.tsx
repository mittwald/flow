import {
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components/Tabs";
import { Alert } from "@mittwald/flow-react-components/Alert";
import { Heading } from "@mittwald/flow-react-components/Heading";
import { AlertIcon } from "@mittwald/flow-react-components/AlertIcon";

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
