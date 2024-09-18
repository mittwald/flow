import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "../Avatar";
import React from "react";
import { Initials } from "@/components/Initials";
import { Image } from "@/components/Image";
import { dummyText } from "@/lib/dev/dummyText";
import IconApp from "@/components/Icon/components/icons/IconApp";

const meta: Meta<typeof Avatar> = {
  title: "Content/Avatar",
  component: Avatar,
  render: (props) => (
    <Avatar {...props}>
      <Image alt="Gopher" src={dummyText.imageSrc} />
    </Avatar>
  ),
  parameters: {
    controls: { exclude: ["className"] },
  },
  args: { size: "m" },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["s", "m", "l"],
    },
    color: {
      control: "inline-radio",
      options: ["blue", "teal", "green", "violet", "lilac"],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const WithInitials: Story = {
  render: (props) => (
    <Avatar {...props}>
      <Initials>Max Mustermann</Initials>
    </Avatar>
  ),
};

export const WithIcon: Story = {
  render: (props) => (
    <Avatar {...props}>
      <IconApp />
    </Avatar>
  ),
  args: { color: "blue" },
};
