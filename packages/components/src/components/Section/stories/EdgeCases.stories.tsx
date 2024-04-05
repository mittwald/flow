import type { Meta, StoryObj } from "@storybook/react";
import Section from "../Section";
import React from "react";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { Switch } from "@/components/Switch";
import defaultStories from "./Default.stories";
import { dummyText } from "@/lib/dev/dummyText";
import Header from "@/components/Header";

const meta: Meta<typeof Section> = {
  ...defaultStories,
  title: "Structure/Section/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof Text>;

export const WithLongHeading: Story = {
  render: (props) => (
    <Section {...props}>
      <Header>
        <Heading>{dummyText.medium}</Heading>
        <Switch>Subscribed</Switch>
      </Header>
      <Text>
        Upcoming releases, new features and tips about your hosting - we bring
        the most important information to inbox. Subscribe to our newsletter and
        stay up to date.
      </Text>
    </Section>
  ),
};

export const SmallSpace: Story = {
  render: (props) => (
    <Section {...props}>
      <Header>
        <Heading>Newsletter Subscription</Heading>
        <Switch>Subscribed</Switch>
      </Header>
      <Text>
        Upcoming releases, new features and tips about your hosting - we bring
        the most important information to inbox. Subscribe to our newsletter and
        stay up to date.
      </Text>
    </Section>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
