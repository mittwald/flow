import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../Badge";
import React from "react";
import { IconApp } from "@/components/Icon/components/icons";
import { Text } from "@/components/Text";

const meta: Meta<typeof Badge> = {
  title: "Status/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "inline-radio",
    },
  },
  parameters: {
    controls: { exclude: ["className"] },
  },
  render: (props) => <Badge {...props}>Info</Badge>,
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const IconOnly: Story = {
  render: (props) => <Badge {...props} />,
};

export const CustomIcon: Story = {
  render: (props) => (
    <Badge {...props}>
      <IconApp />
      <Text>Installation running</Text>
    </Badge>
  ),
};
