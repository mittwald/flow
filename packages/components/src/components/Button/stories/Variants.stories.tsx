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

export const PrimarySolid: Story = {
  args: {
    variant: "primary",
  },
};

export const PrimaryPlain: Story = {
  args: {
    variant: "primary",
    style: "plain",
  },
};

export const SuccessSolid: Story = {
  args: {
    variant: "success",
  },
  render: (props) => <Button {...props}>Create/Save</Button>,
};

export const SuccessPlain: Story = {
  args: {
    variant: "success",
    style: "plain",
  },
  render: (props) => <Button {...props}>Create/Save</Button>,
};

export const SecondarySolid: Story = {
  args: {
    variant: "secondary",
  },
  render: (props) => <Button {...props}>Abort/Back</Button>,
};

export const SecondaryPlain: Story = {
  args: {
    variant: "secondary",
    style: "plain",
  },
  render: (props) => <Button {...props}>Abort/Back</Button>,
};

export const DangerSolid: Story = {
  args: {
    variant: "danger",
  },
  render: (props) => <Button {...props}>Delete/Terminate</Button>,
};

export const DangerPlain: Story = {
  args: {
    variant: "danger",
    style: "plain",
  },
  render: (props) => <Button {...props}>Delete/Terminate</Button>,
};
