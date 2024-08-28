import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Heading } from "@/components/Heading";
import { dummyText } from "@/lib/dev/dummyText";
import defaultMeta from "./Default.stories";
import { Notification } from "@/components/Notification";
import { Text } from "@/components/Text";

const meta: Meta<typeof Notification> = {
  ...defaultMeta,
  title: "Status/Notifications/Notification/Edge Cases",
};

export default meta;

type Story = StoryObj<typeof Notification>;

export const LongTexts: Story = {
  render: (props) => (
    <Notification {...props}>
      <Heading>{dummyText.medium}</Heading>
      <Text>{dummyText.long}</Text>
    </Notification>
  ),
};
