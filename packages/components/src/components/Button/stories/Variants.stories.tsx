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

export const PrimarySoft: Story = {
  args: {
    variant: "primary",
    style: "soft",
  },
};

export const AccentSolid: Story = {
  args: {
    variant: "accent",
  },
  render: (props) => <Button {...props}>Create/Save</Button>,
};

export const AccentPlain: Story = {
  args: {
    variant: "accent",
    style: "plain",
  },
  render: (props) => <Button {...props}>Create/Save</Button>,
};

export const AccentSoft: Story = {
  args: {
    variant: "accent",
    style: "soft",
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

export const SecondarySoft: Story = {
  args: {
    variant: "secondary",
    style: "soft",
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

export const DangerSoft: Story = {
  args: {
    variant: "danger",
    style: "soft",
  },
  render: (props) => <Button {...props}>Delete/Terminate</Button>,
};
