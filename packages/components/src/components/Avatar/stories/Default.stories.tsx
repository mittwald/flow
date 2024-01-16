import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "../Avatar";
import React from "react";
import { Initials } from "@/components/Initials";
import { Image } from "@/components/Image";
import { dummyText } from "@/lib/dev/dummyText";

const meta: Meta<typeof Avatar> = {
  title: "Avatar",
  component: Avatar,
  render: (props) => (
    <Avatar {...props}>
      <Image alt="Gopher" src={dummyText.imageSrc} />
    </Avatar>
  ),
  parameters: {
    controls: { exclude: ["className"] },
  },
  argTypes: {
    size: {
      control: "inline-radio",
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
