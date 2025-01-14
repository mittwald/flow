import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Separator } from "~/components/Separator";

const meta: Meta<typeof Separator> = {
  title: "Structure/Separator",
  component: Separator,
  render: (props) => <Separator {...props} />,
};
export default meta;

type Story = StoryObj<typeof Separator>;

export const Default: Story = {};
