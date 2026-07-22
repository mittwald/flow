import type { Meta, StoryObj } from "@storybook/react";
import LayoutCard from "../LayoutCard";
import { Tab, Tabs, TabTitle } from "@/components/Tabs";
import { Section } from "@/components/Section";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";
import { TabNavigation } from "@/components/TabNavigation";
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
          <TabTitle>Crew</TabTitle>
          <Section>
            <Text>{dummyText.long}</Text>
          </Section>
        </Tab>
        <Tab id="storage">
          <TabTitle>Cargo</TabTitle>
          <Section>
            <Text>{dummyText.long}</Text>
          </Section>
        </Tab>
      </Tabs>
    </LayoutCard>
  ),
};

export const WithTabNavigation: Story = {
  render: (props) => (
    <LayoutCard {...props}>
      <TabNavigation aria-label="Project navigation">
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
      </TabNavigation>
      <Section>Content</Section>
    </LayoutCard>
  ),
};
