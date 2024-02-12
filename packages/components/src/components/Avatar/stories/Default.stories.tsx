import type { Meta, StoryObj } from "@storybook/react";
import Avatar from "../Avatar";
import React from "react";
import { Initials } from "@/components/Initials";
import { Image } from "@/components/Image";
import { dummyText } from "@/lib/dev/dummyText";
import { Skeleton } from "@/components/Skeleton";

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

export const WithSkeleton: Story = {
  render: (props) => (
    <Avatar {...props}>
      <Skeleton />
    </Avatar>
  ),
};
