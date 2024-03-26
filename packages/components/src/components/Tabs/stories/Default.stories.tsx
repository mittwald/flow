import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tab, TabPanel, Tabs } from "@/components/Tabs";
import { TabList } from "@/components/Tabs/components/TabList";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  render: (props) => (
    <Tabs {...props}>
      <TabList>
        <Tab id="general">General</Tab>
        <Tab id="software">Software</Tab>
        <Tab id="configuration">Configuration</Tab>
      </TabList>
      <TabPanel id="general">
        <Section>
          <Heading>General</Heading>
          <Text>{dummyText.medium}</Text>
        </Section>
      </TabPanel>
      <TabPanel id="software">
        <Section>
          <Heading>Software</Heading>
          <Text>{dummyText.long}</Text>
        </Section>
      </TabPanel>
      <TabPanel id="configuration">
        <Section>
          <Heading>Configuration</Heading>
          <TextField>
            <Label>Hostname</Label>
          </TextField>
        </Section>
      </TabPanel>
    </Tabs>
  ),
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};
