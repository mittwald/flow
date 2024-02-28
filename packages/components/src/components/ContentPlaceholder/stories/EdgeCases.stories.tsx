import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "@/components/Text";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";
import { ContentPlaceholder } from "../ContentPlaceholder";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/Button";
import { IconApp } from "@/components/Icon/components/icons";

const meta: Meta<typeof ContentPlaceholder> = {
  ...defaultMeta,
  title: "Content/Content Placeholder/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof ContentPlaceholder>;

export const LongTexts: Story = {
  render: (props) => (
    <ContentPlaceholder {...props}>
      <IconApp />
      <Heading>{dummyText.medium}</Heading>
      <Text>{dummyText.long}</Text>
      <Button variant="accent">Create app</Button>
    </ContentPlaceholder>
  ),
};

export const SmallSpace: Story = {
  render: (props) => (
    <ContentPlaceholder {...props}>
      <IconApp />
      <Heading>No apps installed</Heading>
      <Text>Create your first app to start working on your website.</Text>
      <Button variant="accent">Create app</Button>
    </ContentPlaceholder>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
