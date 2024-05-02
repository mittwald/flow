import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import defaultMeta from "./Default.stories";
import React from "react";

const meta: Meta<typeof Button> = {
  ...defaultMeta,
  title: "Actions/Button/Variants",
};

export default meta;

type Story = StoryObj<typeof Button>;

export const PrimarySolid: Story = {
  args: {
    color: "primary",
  },
};

export const PrimaryPlain: Story = {
  args: {
    color: "primary",
    variant: "plain",
  },
};

export const PrimarySoft: Story = {
  args: {
    color: "primary",
    variant: "soft",
  },
};

export const AccentSolid: Story = {
  args: {
    color: "accent",
  },
  render: (props) => <Button {...props}>Create/Save</Button>,
};

export const AccentPlain: Story = {
  args: {
    color: "accent",
    variant: "plain",
  },
  render: (props) => <Button {...props}>Create/Save</Button>,
};

export const AccentSoft: Story = {
  args: {
    color: "accent",
    variant: "soft",
  },
  render: (props) => <Button {...props}>Create/Save</Button>,
};

export const SecondarySolid: Story = {
  args: {
    color: "secondary",
  },
  render: (props) => <Button {...props}>Abort/Back</Button>,
};

export const SecondaryPlain: Story = {
  args: {
    color: "secondary",
    variant: "plain",
  },
  render: (props) => <Button {...props}>Abort/Back</Button>,
};

export const SecondarySoft: Story = {
  args: {
    color: "secondary",
    variant: "soft",
  },
  render: (props) => <Button {...props}>Abort/Back</Button>,
};

export const DangerSolid: Story = {
  args: {
    color: "danger",
  },
  render: (props) => <Button {...props}>Delete/Terminate</Button>,
};

export const DangerPlain: Story = {
  args: {
    color: "danger",
    variant: "plain",
  },
  render: (props) => <Button {...props}>Delete/Terminate</Button>,
};

export const DangerSoft: Story = {
  args: {
    color: "danger",
    variant: "soft",
  },
  render: (props) => <Button {...props}>Delete/Terminate</Button>,
};
