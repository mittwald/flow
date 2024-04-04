import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tab, TabPanel, Tabs } from "@/components/Tabs";
import { TabList } from "@/components/Tabs/components/TabList";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { LabeledValue } from "@/components/LabeledValue";
import { Switch } from "@/components/Switch";
import { Header } from "@/components/Header";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  render: (props) => (
    <Tabs {...props}>
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
            The spam filter protects you from unwanted emails. Nobody wants
            garbage in their inbox, so we recommend that you always leave spam
            protection activated.
          </Text>
        </Section>
      </TabPanel>
    </Tabs>
  ),
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const SmallSpace: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
