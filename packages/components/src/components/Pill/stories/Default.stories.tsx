import type { Meta, StoryObj } from "@storybook/react";
import Pill from "../Pill";
import React from "react";
import { faHourglass } from "@fortawesome/free-regular-svg-icons/faHourglass";
import { Icon } from "@/components/Icon";
import { Text } from "@/components/Text";

const meta: Meta<typeof Pill> = {
  title: "Pill",
  component: Pill,
  render: (props) => <Pill {...props}>Info</Pill>,
};
export default meta;

type Story = StoryObj<typeof Pill>;

export const Default: Story = {};

export const IconOnly: Story = {
  render: (props) => <Pill {...props} />,
};

export const CustomIcon: Story = {
  render: (props) => (
    <Pill {...props}>
      <Icon faIcon={faHourglass} />
      <Text>Installation running</Text>
    </Pill>
  ),
};
