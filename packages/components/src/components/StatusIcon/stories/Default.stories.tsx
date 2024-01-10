import type { Meta, StoryObj } from "@storybook/react";
import StatusIcon from "../StatusIcon";
import React from "react";
import { Heading } from "@/components/Heading";
import { Content } from "@/components/Content";
import { Icon } from "@/components/Icon";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";

const meta: Meta<typeof StatusIcon> = {
  title: "StatusIcon",
  component: StatusIcon,
};

export default meta;

type Story = StoryObj<typeof StatusIcon>;

export const Info: Story = {
  args: { variant: "info" },
};

export const Success: Story = {
  args: { variant: "success" },
};

export const Warning: Story = {
  args: { variant: "warning" },
};

export const Negative: Story = {
  args: { variant: "negative" },
};
