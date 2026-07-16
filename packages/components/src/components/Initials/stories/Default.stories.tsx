import type { Meta, StoryObj } from "@storybook/react";
import Initials from "../Initials";
import { Flex } from "@/components/Flex";
import { Avatar } from "@/components/Avatar";

const meta: Meta<typeof Initials> = {
  title: "Content/Initials",
  component: Initials,
  render: (props) => <Initials {...props}>Max Mustermann</Initials>,
  parameters: {
    controls: { disable: true },
  },
};
export default meta;

type Story = StoryObj<typeof Initials>;

export const Default: Story = {};

export const OneLetter: Story = {
  render: (props) => <Initials {...props}>Max </Initials>,
};

export const Emoji: Story = {
  render: (props) => (
    <Flex direction="column">
      <Avatar>
        <Initials {...props}>😄</Initials>
      </Avatar>
    </Flex>
  ),
};
