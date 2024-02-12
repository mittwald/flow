import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CopyToClipboardButton } from "../CopyToClipboardButton";

const meta: Meta<typeof CopyToClipboardButton> = {
  title: "Buttons/CopyToClipboardButton",
  component: CopyToClipboardButton,
  render: (props) => <CopyToClipboardButton {...props} />,
  args: {
    text: "Copied content",
  },
  parameters: {
    controls: { exclude: ["text", "className"] },
  },
};
export default meta;

type Story = StoryObj<typeof CopyToClipboardButton>;

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
