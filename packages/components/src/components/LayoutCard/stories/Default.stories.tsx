import type { Meta, StoryObj } from "@storybook/react";
import LayoutCard from "../LayoutCard";
import React from "react";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";
import { HorizontalNavigation } from "@/components/HorizontalNavigation";
import { Link } from "@/components/Link";
import { AlertIcon } from "@/components/AlertIcon";

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

export const WithHorizontalNavigation: Story = {
  render: (props) => (
    <LayoutCard {...props}>
      <HorizontalNavigation aria-label="Project navigation">
        <Link href="#">Apps</Link>
        <Link href="#" aria-current="page">
          Container
        </Link>
        <Link href="#">Domains</Link>
        <Link href="#">E-Mails</Link>
        <Link href="#">
          Databases
          <AlertIcon status="warning" />
        </Link>
        <Link href="#">Backups</Link>
      </HorizontalNavigation>
      <Section>Content</Section>
    </LayoutCard>
  ),
};
