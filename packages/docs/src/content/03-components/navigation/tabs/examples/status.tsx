import {
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components/Tabs";
import { InlineAlert } from "@mittwald/flow-react-components/InlineAlert";
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
    <InlineAlert status="danger">
      <Heading>Dein Speicherplatz ist voll</Heading>
    </InlineAlert>
  </Tab>
  <Tab>
    <TabTitle>Spamschutz</TabTitle>
    Spamschutz Inhalt
  </Tab>
</Tabs>;
