import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tab, TabPanel, Tabs } from "@/components/Tabs";
import { TabList } from "@/components/Tabs/components/TabList";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";

const meta: Meta<typeof Tabs> = {
  ...defaultMeta,
  title: "Navigation/Tabs/Edge Cases",
  component: Tabs,
  render: (props) => (
    <Tabs {...props}>
      <TabList>
        <Tab id="a">{dummyText.short}</Tab>
        <Tab id="b">{dummyText.short}</Tab>
        <Tab id="c">{dummyText.short}</Tab>
        <Tab id="d">{dummyText.short}</Tab>
      </TabList>
      <TabPanel id="a">
        <Section>
          <Heading>{dummyText.short}</Heading>
          <Text>{dummyText.medium}</Text>
        </Section>
      </TabPanel>
      <TabPanel id="b">
        <Section>
          <Heading>{dummyText.short}</Heading>
          <Text>{dummyText.medium}</Text>
        </Section>
      </TabPanel>
      <TabPanel id="c">
        <Section>
          <Heading>{dummyText.short}</Heading>
          <Text>{dummyText.medium}</Text>
        </Section>
      </TabPanel>
      <TabPanel id="d">
        <Section>
          <Heading>{dummyText.short}</Heading>
          <Text>{dummyText.medium}</Text>
        </Section>
      </TabPanel>
    </Tabs>
  ),
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const LongTexts: Story = {};
