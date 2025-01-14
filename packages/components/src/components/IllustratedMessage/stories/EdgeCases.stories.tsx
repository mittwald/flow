import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Text } from "~/components/Text";
import { dummyText } from "~/lib/dev/dummyText";
import defaultMeta from "./Default.stories";
import { IllustratedMessage } from "../IllustratedMessage";
import { Heading } from "~/components/Heading";
import { Button } from "~/components/Button";
import { IconApp } from "~/components/Icon/components/icons";

const meta: Meta<typeof IllustratedMessage> = {
  ...defaultMeta,
  title: "Content/Illustrated Message/Edge Cases",
};
export default meta;

type Story = StoryObj<typeof IllustratedMessage>;

export const LongTexts: Story = {
  render: (props) => (
    <IllustratedMessage {...props}>
      <IconApp />
      <Heading>{dummyText.medium}</Heading>
      <Text>{dummyText.long}</Text>
      <Button>Create app</Button>
    </IllustratedMessage>
  ),
};

export const SmallSpace: Story = {
  render: (props) => (
    <IllustratedMessage {...props}>
      <IconApp />
      <Heading>No apps installed</Heading>
      <Text>Create your first app to start working on your website.</Text>
      <Button>Create app</Button>
    </IllustratedMessage>
  ),
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
