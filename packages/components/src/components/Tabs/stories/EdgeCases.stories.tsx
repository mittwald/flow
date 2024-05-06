import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs/Edge Cases",
  ...defaultMeta,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const DifferentHeight: Story = {
  render: (props) => (
    <Tabs {...props} disabledKeys={["spam"]}>
      <Tab id="a">
        <TabTitle>Tab A</TabTitle>
        <Section>
          <Text>{dummyText.long}</Text>
        </Section>
      </Tab>
      <Tab id="b">
        <TabTitle>Tab B</TabTitle>
        <Section>
          <Text>{dummyText.long}</Text>
        </Section>
        <Section>
          <Text>{dummyText.long}</Text>
        </Section>
        <Section>
          <Text>{dummyText.long}</Text>
        </Section>
        <Section>
          <Text>{dummyText.long}</Text>
        </Section>
      </Tab>
    </Tabs>
  ),
};
