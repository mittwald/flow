import type { Meta, StoryObj } from "@storybook/react";
import Badge from "../Badge";
import React from "react";
import { faHourglass } from "@fortawesome/free-regular-svg-icons/faHourglass";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";
import { Skeleton } from "@/components/Skeleton";

const meta: Meta<typeof Badge> = {
  title: "Badge",
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
      <Icon faIcon={faHourglass} />
      <Text>Installation running</Text>
    </Badge>
  ),
};
