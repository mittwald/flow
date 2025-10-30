import type { Meta, StoryObj } from "@storybook/react";
import LayoutCard from "../LayoutCard";
import React from "react";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { AlertIcon } from "@/components/AlertIcon";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { LabeledValue } from "@/components/LabeledValue";
import { Text } from "@/components/Text";

const meta: Meta<typeof LayoutCard> = {
  title: "Structure/Layout Card",
  component: LayoutCard,
  argTypes: {
    elementType: {
      control: "inline-radio",
      options: ["div", "main"],
    },
  },
  args: { elementType: "div" },
  render: (props) => (
    <LayoutCard {...props}>
      Layout Card is a structure element that can contain any content
    </LayoutCard>
  ),
};
export default meta;

type Story = StoryObj<typeof LayoutCard>;

export const Default: Story = {};

export const WithTabs: Story = {
  render: (props) => (
    <LayoutCard {...props}>
      <Tabs>
        <Tab id="general">
          <TabTitle>
            General
            <AlertIcon status="info" />
          </TabTitle>
          <Section>
            <Heading>General</Heading>
            <TextField defaultValue="example@mittwald.de">
              <Label>Mail address</Label>
            </TextField>
          </Section>
        </Tab>
        <Tab id="storage">
          <TabTitle>Storage settings</TabTitle>
          <Section>
            <Heading>Storage</Heading>
            <LabeledValue>
              <Label>Available storage</Label>
              <Text>2.4 GB</Text>
            </LabeledValue>
          </Section>
        </Tab>
      </Tabs>
    </LayoutCard>
  ),
};
