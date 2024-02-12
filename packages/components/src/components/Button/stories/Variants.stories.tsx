import type { Meta, StoryObj } from "@storybook/react";
import Button from "../Button";
import defaultMeta from "./Default.stories";

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

export const AccentSolid: Story = {
  args: {
    variant: "accent",
  },
};

export const AccentPlain: Story = {
  args: {
    variant: "accent",
    style: "plain",
  },
};

export const SecondarySolid: Story = {
  args: {
    variant: "secondary",
  },
};

export const SecondaryPlain: Story = {
  args: {
    variant: "secondary",
    style: "plain",
  },
};

export const DangerSolid: Story = {
  args: {
    variant: "danger",
  },
};

export const DangerPlain: Story = {
  args: {
    variant: "danger",
    style: "plain",
  },
};
