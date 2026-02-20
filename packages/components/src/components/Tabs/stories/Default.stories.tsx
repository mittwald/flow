import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Section } from "@/components/Section";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { TextField } from "@/components/TextField";
import { Label } from "@/components/Label";
import { LabeledValue } from "@/components/LabeledValue";
import { Switch } from "@/components/Switch";
import { Header } from "@/components/Header";
import { AlertIcon } from "@/components/AlertIcon";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Tabs> = {
  title: "Navigation/Tabs",
  component: Tabs,
  render: (props) => {
    return (
      <Tabs {...props} disabledKeys={["spam"]}>
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
        <Tab id="spam">
          <TabTitle>Spam</TabTitle>
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
        </Tab>
      </Tabs>
    );
  },
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {};

export const Controlled: Story = {
  args: { selectedKey: "storage" },
};

export const Collapsed: Story = {
  render: (props) => (
    <Tabs {...props}>
      {Array(20)
        .fill("")
        .map((_, index) => (
          <Tab key={index}>
            <TabTitle>{dummyText.short}</TabTitle>
            <Section>
              <Text>{dummyText.long}</Text>
            </Section>
          </Tab>
        ))}
    </Tabs>
  ),
};
