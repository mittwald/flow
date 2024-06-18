import Tabs, {
  Tab,
  TabTitle,
} from "@mittwald/flow-react-components/Tabs";
import Link from "@mittwald/flow-react-components/Link";

<Column>
  <Tabs>
    <Tab>
      <TabTitle>Allgemein</TabTitle>
      Allgemeiner Inhalt
    </Tab>
    <Tab id="myTab">
      <TabTitle>Speicherplatz</TabTitle>
      Speicherplatz Inhalt
    </Tab>
    <Tab>
      <TabTitle>Spamschutz</TabTitle>
      Spamschutz Inhalt
    </Tab>
  </Tabs>
  <Link href="#myTab" target="_blank">
    Anchor Link zum Speicherplatz Tab
  </Link>
</Column>;
