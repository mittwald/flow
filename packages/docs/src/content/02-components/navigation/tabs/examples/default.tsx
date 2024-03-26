import {
  Tab,
  TabPanel,
  Tabs,
  TabList,
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
  <TabList>
    <Tab id="general">General</Tab>
    <Tab id="storage">Storage</Tab>
    <Tab id="spam">Spam protection</Tab>
  </TabList>
  <TabPanel id="general">
    <Section>
      <Heading>General</Heading>
      <TextField defaultValue="example@mittwald.de">
        <Label>Mail address</Label>
      </TextField>
    </Section>
  </TabPanel>
  <TabPanel id="storage">
    <Section>
      <Heading>Storage</Heading>
      <LabeledValue>
        <Label>Available storage</Label>
        <Text>2.4 GB</Text>
      </LabeledValue>
    </Section>
  </TabPanel>
  <TabPanel id="spam">
    <Section>
      <Header>
        <Heading>Spam protection</Heading>
        <Switch>Spam protection</Switch>
      </Header>
      <Text>
        The spam filter protects you from unwanted emails.
        Nobody wants garbage in their inbox, so we recommend
        that you always leave spam protection activated.
      </Text>
    </Section>
  </TabPanel>
</Tabs>;
