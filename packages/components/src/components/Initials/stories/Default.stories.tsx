import type { Meta, StoryObj } from "@storybook/react";
import Initials from "../Initials";
import React from "react";

export const createInitialsFromString = (
  initials: string,
): AvatarInitials | undefined => {
  const parts = Array.isArray(initials) ? initials : initials.split(" ");

  const avatarInitials = parts
    .map((part) => part?.trim()[0])
    .filter(isDefined)
    .map((i) => i.toUpperCase())
    .slice(0, 2);

  if (avatarInitials.length === 0) {
    return undefined;
  }

  return avatarInitials as AvatarInitials;
};

const meta: Meta<typeof Text> = {
  title: "Initials",
  component: Initials,
  render: (props) => <Initials {...props}>Max Mustermann</Initials>,
};
export default meta;

type Story = StoryObj<typeof Initials>;

export const Default: Story = {};
