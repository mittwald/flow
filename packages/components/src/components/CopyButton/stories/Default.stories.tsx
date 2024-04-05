import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CopyButton } from "../CopyButton";

const meta: Meta<typeof CopyButton> = {
  title: "Actions/CopyButton",
  component: CopyButton,
  render: (props) => <CopyButton {...props} />,
  args: {
    text: "Copied content",
  },
  parameters: {
    controls: { exclude: ["text", "className"] },
  },
};
export default meta;

type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {};

export const WithReactNodeText: Story = {
  args: {
    text: (
      <span>
        Text <span>inside span</span>
      </span>
    ),
  },
};
