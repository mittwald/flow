import type { Meta, StoryObj } from "@storybook/react";
import LayoutCard from "../LayoutCard";
import React from "react";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof LayoutCard> = {
  title: "Structure/Layout Card",
  component: LayoutCard,
  render: (props) => (
    <LayoutCard {...props}>
      Layout Card is a structure element that can contain any content
    </LayoutCard>
  ),
  parameters: {
    controls: { disable: true },
  },
  globals: {
    backgrounds: "light",
  },
};
export default meta;

type Story = StoryObj<typeof LayoutCard>;

export const Default: Story = {};

export const WithTabs: Story = {
  render: (props) => (
    <LayoutCard {...props}>
      <Tabs>
        <Tab id="general">
          <TabTitle>General</TabTitle>
          <Section>
            <Text>{dummyText.long}</Text>
          </Section>
        </Tab>
        <Tab id="storage">
          <TabTitle>Storage</TabTitle>
          <Section>
            <Text>{dummyText.long}</Text>
          </Section>
        </Tab>
      </Tabs>
    </LayoutCard>
  ),
};
