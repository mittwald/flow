import type { Meta, StoryObj } from "@storybook/react";
import { Truncate } from "../index";
import React from "react";
import { dummyText } from "@/lib/dev/dummyText";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { ColumnLayout } from "@/components/ColumnLayout";

const meta: Meta<typeof Truncate> = {
  title: "Content/Truncate",
  component: Truncate,
  parameters: {
    controls: { exclude: ["title"] },
  },
  render: (props) => <Truncate {...props}>{dummyText.long}</Truncate>,
};
export default meta;

type Story = StoryObj<typeof Truncate>;

export const Default: Story = {};

export const InText: Story = {
  render: (props) => (
    <Text>
      <Truncate {...props}>{dummyText.long}</Truncate>
    </Text>
  ),
};
export const InHeading: Story = {
  render: (props) => (
    <Heading>
      <Truncate {...props}>{dummyText.long}</Truncate>
    </Heading>
  ),
};

export const Offset: Story = {
  args: { offset: 10 },
  render: (props) => (
    <Text>
      <Truncate {...props}>{dummyText.long}</Truncate>
    </Text>
  ),
};

export const CustomEllipsis: Story = {
  args: { ellipsis: "[...]" },
  render: (props) => (
    <ColumnLayout>
      <Truncate {...props}>{dummyText.long}</Truncate>
    </ColumnLayout>
  ),
};
