import {
  Tab,
  Tabs,
  TabTitle,
} from "@mittwald/flow-react-components/Tabs";
import { InlineAlert } from "@mittwald/flow-react-components/InlineAlert";
import { Heading } from "@mittwald/flow-react-components/Heading";

<Tabs>
  <Tab>
    <TabTitle>Allgemein</TabTitle>
    Allgemeiner Inhalt
  </Tab>
  <Tab id="storage" status="danger">
    <TabTitle>Speicherplatz</TabTitle>
    <InlineAlert status="danger">
      <Heading>Dein Speicherplatz ist voll</Heading>
    </InlineAlert>
  </Tab>
  <Tab>
    <TabTitle>Spamschutz</TabTitle>
    Spamschutz Inhalt
  </Tab>
</Tabs>;
