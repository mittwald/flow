import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import defaultMeta from "./Default.stories";
import React from "react";

const meta: Meta<typeof Button> = {
  ...defaultMeta,
  title: "Buttons/Button/Variants",
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
  },
  render: (props) => <Button {...props}>Create/Save</Button>,
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
  render: (props) => <Button {...props}>Abort/Back</Button>,
};

export const Danger: Story = {
  args: {
    variant: "danger",
  },
  render: (props) => <Button {...props}>Delete/Terminate</Button>,
};

export const Plain: Story = {
  args: {
    variant: "plain",
  },
};
