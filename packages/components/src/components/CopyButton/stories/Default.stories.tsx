import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CopyButton } from "../CopyButton";

const meta: Meta<typeof CopyButton> = {
  title: "CopyButton",
  component: CopyButton,
  render: () => <CopyButton value="Copied Content" />,
};
export default meta;

type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {};
