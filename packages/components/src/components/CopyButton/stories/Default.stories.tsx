import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CopyButton } from "../CopyButton";

const meta: Meta<typeof CopyButton> = {
  title: "Buttons/CopyButton",
  component: CopyButton,
  render: (props) => <CopyButton {...props} value="Copied Content" />,
  parameters: {
    controls: { exclude: ["value", "className"] },
  },
};
export default meta;

type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {};
