import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../Badge";
import React from "react";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { IconHourglassEmpty } from "@tabler/icons-react";

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
      <Icon>
        <IconHourglassEmpty />
      </Icon>
      <Text>Installation running</Text>
    </Badge>
  ),
};
